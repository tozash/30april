import React, { useEffect, useRef, useState } from 'react';
import { loadHandposeModel, detectHandPoseFromLandmarks, HandPose } from '../utils/HandPose';
import CompletionScreen from './CompletionScreen';

interface HandVisualizerProps {
  onGestureDetected?: (gesture: HandPose) => void;
  setShowHint?: (show: boolean) => void;
  handleShowAnswer?: () => void;
  handleRateCard?: (label: string) => void;
  showAnswer?: boolean;
  showHint?: boolean;
  holdTimeMs?: number;
  onNextDay?: () => void;
  showComplete?: boolean;
}

const HandVisualizer: React.FC<HandVisualizerProps> = ({
  onGestureDetected,
  setShowHint,
  handleShowAnswer,
  handleRateCard,
  showAnswer,
  showHint,
  holdTimeMs = 3000,
  onNextDay,
  showComplete
}) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [handPose, setHandPose] = useState<HandPose>(null);
  const [progress, setProgress] = useState(0);
  const [isHolding, setIsHolding] = useState(false);
  
  // Refs for tracking state between renders
  const lastPoseRef = useRef<HandPose>(null);
  const holdStartTimeRef = useRef<number | null>(null);
  const animationFrameRef = useRef<number | null>(null);
  const lastExecutionTimeRef = useRef<number>(0);
  const progressAnimationRef = useRef<number | null>(null);
  
  const COOLDOWN_PERIOD = 1000; // 1 second cooldown

  const resetProgress = () => {
    setProgress(0);
    setIsHolding(false);
    if (progressAnimationRef.current) {
      cancelAnimationFrame(progressAnimationRef.current);
    }
    holdStartTimeRef.current = null;
  };

  const executeGesture = (pose: HandPose) => {
    const now = Date.now();
    if (now - lastExecutionTimeRef.current < COOLDOWN_PERIOD) {
      return;
    }

    if (pose === 'ok_sign' && onNextDay) {
      onNextDay();
    } else if (!showAnswer) {
      if (pose === 'index_extended' && setShowHint) {
        setShowHint(!showHint);
      } else if (pose === 'index_middle_extended' && handleShowAnswer) {
        handleShowAnswer();
      }
    } else if (handleRateCard) {
      switch (pose) {
        case 'thumbs_up':
          handleRateCard('Easy');
          break;
        case 'flat_hand':
          handleRateCard('Hard');
          break;
        case 'thumbs_down':
          handleRateCard('Wrong');
          break;
        default:
          break;
      }
    }
    
    lastExecutionTimeRef.current = now;
    resetProgress();
  };

  const updateProgress = (timestamp: number) => {
    if (!holdStartTimeRef.current || !lastPoseRef.current) {
      return;
    }

    const elapsed = timestamp - holdStartTimeRef.current;
    const newProgress = Math.min((elapsed / holdTimeMs) * 100, 100);
    
    setProgress(newProgress);

    if (newProgress >= 100) {
      executeGesture(lastPoseRef.current);
    } else {
      progressAnimationRef.current = requestAnimationFrame(updateProgress);
    }
  };

  const handleGestureDetection = (pose: HandPose) => {
    if (!pose) {
      resetProgress();
      lastPoseRef.current = null;
      return;
    }

    if (pose !== lastPoseRef.current) {
      lastPoseRef.current = pose;
      holdStartTimeRef.current = performance.now();
      setIsHolding(true);
      
      if (progressAnimationRef.current) {
        cancelAnimationFrame(progressAnimationRef.current);
      }
      progressAnimationRef.current = requestAnimationFrame(updateProgress);
    }
  };

  const setupCamera = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: {
          width: { ideal: 640 },
          height: { ideal: 480 },
          facingMode: 'user'
        }
      });
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
      }
    } catch (err) {
      console.error('Error accessing camera:', err);
    }
  };

  useEffect(() => {
    let model: any;

    const detectHandPose = async () => {
      if (!videoRef.current || !canvasRef.current || !model) return;

      const video = videoRef.current;
      const canvas = canvasRef.current;
      const ctx = canvas.getContext('2d');

      if (!ctx) return;

      canvas.width = video.videoWidth || 640;
      canvas.height = video.videoHeight || 480;

      const predictions = await model.estimateHands(video);
      
      ctx.save();
      ctx.scale(-1, 1);
      ctx.drawImage(video, -canvas.width, 0, canvas.width, canvas.height);
      ctx.restore();
      
      if (predictions.length > 0) {
        const landmarks = predictions[0].landmarks;
        const detectedPose = detectHandPoseFromLandmarks(landmarks);
        setHandPose(detectedPose);
        
        if (detectedPose) {
          onGestureDetected?.(detectedPose);
          handleGestureDetection(detectedPose);
        }
        
        // Draw landmarks
        ctx.strokeStyle = '#00FF00';
        ctx.lineWidth = 2;
        landmarks.forEach((point: number[]) => {
          ctx.beginPath();
          ctx.arc(canvas.width - point[0], point[1], 3, 0, 2 * Math.PI);
          ctx.fill();
          ctx.stroke();
        });
      } else {
        setHandPose(null);
        handleGestureDetection(null);
      }

      animationFrameRef.current = requestAnimationFrame(detectHandPose);
    };

    const initialize = async () => {
      await setupCamera();
      model = await loadHandposeModel();
      detectHandPose();
    };

    initialize();

    return () => {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
      if (progressAnimationRef.current) {
        cancelAnimationFrame(progressAnimationRef.current);
      }
      if (videoRef.current?.srcObject) {
        const stream = videoRef.current.srcObject as MediaStream;
        stream.getTracks().forEach(track => track.stop());
      }
    };
  }, [onGestureDetected, setShowHint, handleShowAnswer, handleRateCard, showAnswer, showHint, holdTimeMs, onNextDay]);

  const getGestureAction = (pose: HandPose): string => {
    if (showComplete) {
      if (pose === 'ok_sign') {
        return '👌 Next Day';
      }
      return '';
    }
    
    if (!showAnswer) {
      switch (pose) {
        case 'index_extended':
          return '👆 Toggle Hint';
        case 'index_middle_extended':
          return '✌️ Show Answer';
        case 'ok_sign':
          return '👌 Next Day';
        default:
          return '';
      }
    } else {
      switch (pose) {
        case 'thumbs_up':
          return '👍 Rate Easy';
        case 'flat_hand':
          return '✋ Rate Hard';
        case 'thumbs_down':
          return '👎 Rate Wrong';
        case 'ok_sign':
          return '👌 Next Day';
        default:
          return '';
      }
    }
  };

  return (
    <div className="relative w-[320px] h-[240px] rounded-xl overflow-hidden shadow-lg bg-black">
      <video
        ref={videoRef}
        autoPlay
        playsInline
        muted
        className="w-full h-full object-cover"
      />
      <canvas
        ref={canvasRef}
        className="absolute top-0 left-0 w-full h-full"
      />
      {handPose && (
        <div className="absolute top-2 left-2 bg-white bg-opacity-90 px-3 py-1.5 rounded-lg shadow-md">
          <div className="flex flex-col gap-1">
            <p className="text-sm font-medium text-gray-800">
              {getGestureAction(handPose)}
            </p>
            {isHolding && progress > 0 && (
              <div className="w-24 h-1.5 bg-gray-200 rounded-full overflow-hidden">
                <div 
                  className="h-full bg-green-500 transition-all duration-100 ease-linear"
                  style={{ width: `${progress}%` }}
                />
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default HandVisualizer;