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
  const [isHolding, setIsHolding] = useState(false);
  const [timeLeft, setTimeLeft] = useState(3);
  const [progress, setProgress] = useState(0);
  
  // Refs for tracking state between renders
  const handPoseRef = useRef<HandPose>(null);
  const holdStartTimeRef = useRef<number | null>(null);
  const animationFrameRef = useRef<number | null>(null);
  const lastExecutionTimeRef = useRef<number>(0);
  const COOLDOWN_PERIOD = 1000; // 1 second cooldown between gestures

  const executeGesture = (pose: HandPose) => {
    const now = Date.now();
    if (now - lastExecutionTimeRef.current < COOLDOWN_PERIOD) {
      return; // Still in cooldown
    }

    if (!showAnswer) {
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
    holdStartTimeRef.current = null;
    setIsHolding(false);
    setProgress(0);
    setTimeLeft(3);
  };

  const updateHoldProgress = () => {
    if (!holdStartTimeRef.current || !handPoseRef.current) {
      return;
    }

    const now = Date.now();
    const elapsedTime = now - holdStartTimeRef.current;
    const newProgress = Math.min((elapsedTime / holdTimeMs) * 100, 100);
    const newTimeLeft = Math.max(Math.ceil((holdTimeMs - elapsedTime) / 1000), 0);

    setProgress(newProgress);
    setTimeLeft(newTimeLeft);

    if (elapsedTime >= holdTimeMs) {
      executeGesture(handPoseRef.current);
    } else {
      animationFrameRef.current = requestAnimationFrame(updateHoldProgress);
    }
  };

  const handleGestureDetection = (pose: HandPose) => {
    if (pose !== handPoseRef.current) {
      // New gesture detected
      handPoseRef.current = pose;
      holdStartTimeRef.current = Date.now();
      setIsHolding(true);
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
      updateHoldProgress();
    }
  };

  const setupCamera = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: {
          width: { ideal: 640 },
          height: { ideal: 480 }
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

      // Set canvas size to match video
      if (canvas.width !== video.videoWidth || canvas.height !== video.videoHeight) {
        canvas.width = video.videoWidth;
        canvas.height = video.videoHeight;
      }

      // Detect hand pose
      const predictions = await model.estimateHands(video);
      
      if (predictions.length > 0) {
        const landmarks = predictions[0].landmarks;
        const detectedPose = detectHandPoseFromLandmarks(landmarks);
        setHandPose(detectedPose);
        
        if (detectedPose) {
          onGestureDetected?.(detectedPose);
          handleGestureDetection(detectedPose);
        }
        
        // Draw hand visualization
        drawHand(ctx, landmarks);
      } else {
        setHandPose(null);
        handPoseRef.current = null;
        holdStartTimeRef.current = null;
        setIsHolding(false);
        setProgress(0);
        setTimeLeft(3);
        // Clear canvas when no hand is detected
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        if (videoRef.current) {
          ctx.drawImage(videoRef.current, 0, 0, canvas.width, canvas.height);
        }
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
      if (videoRef.current?.srcObject) {
        const stream = videoRef.current.srcObject as MediaStream;
        stream.getTracks().forEach(track => track.stop());
      }
    };
  }, [onGestureDetected, setShowHint, handleShowAnswer, handleRateCard, showAnswer, showHint, holdTimeMs]);

  const drawHand = (ctx: CanvasRenderingContext2D, landmarks: [number, number][]) => {
    // Clear the canvas first
    ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);

    // Draw video frame
    if (videoRef.current) {
      ctx.drawImage(videoRef.current, 0, 0, ctx.canvas.width, ctx.canvas.height);
    }

    // Draw palm connections first (thicker lines)
    ctx.strokeStyle = '#00FF00';
    ctx.lineWidth = 3;
    const HAND_CONNECTIONS = [
      // Thumb
      [0, 1], [1, 2], [2, 3], [3, 4],
      // Index finger
      [0, 5], [5, 6], [6, 7], [7, 8],
      // Middle finger
      [0, 9], [9, 10], [10, 11], [11, 12],
      // Ring finger
      [0, 13], [13, 14], [14, 15], [15, 16],
      // Pinky finger
      [0, 17], [17, 18], [18, 19], [19, 20],
      // Palm connections
      [5, 9], [9, 13], [13, 17],
      // Wrist to fingers
      [0, 5], [0, 9], [0, 13], [0, 17]
    ];

    HAND_CONNECTIONS.forEach(([i, j]) => {
      ctx.beginPath();
      ctx.moveTo(landmarks[i][0], landmarks[i][1]);
      ctx.lineTo(landmarks[j][0], landmarks[j][1]);
      ctx.stroke();
    });

    // Draw landmarks
    ctx.fillStyle = 'red';
    landmarks.forEach((point: [number, number]) => {
      ctx.beginPath();
      ctx.arc(point[0], point[1], 5, 0, 2 * Math.PI);
      ctx.fill();
    });
  };

  const getGestureAction = (pose: HandPose): string => {
    if (!showAnswer) {
      switch (pose) {
        case 'index_extended':
          return '👆 Toggle Hint';
        case 'index_middle_extended':
          return '✌️ Show Answer';
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
        default:
          return '';
      }
    }
  };

  return (
    <div className="relative w-[320px] h-[240px] rounded-xl overflow-hidden shadow-lg">
      <video
        ref={videoRef}
        autoPlay
        playsInline
        muted
        className="w-full h-full object-cover"
        style={{ transform: 'scaleX(-1)' }}
      />
      <canvas
        ref={canvasRef}
        className="absolute top-0 left-0 w-full h-full"
        style={{ transform: 'scaleX(-1)' }}
      />
      {handPose && (
        <>
          <div className="absolute top-4 right-4 bg-white bg-opacity-75 px-4 py-2 rounded-lg">
            <p className="text-lg font-semibold">{getGestureAction(handPose)}</p>
          </div>
          {isHolding && (
            <div className="absolute bottom-4 left-4 right-4 bg-white bg-opacity-90 px-4 py-3 rounded-lg shadow-lg">
              <div className="flex flex-col gap-2">
                <p className="text-lg font-semibold text-center text-gray-800">
                  Hold for: {timeLeft}s
                </p>
                <div className="w-full h-3 bg-gray-200 rounded-full">
                  <div
                    className="h-full bg-green-500 rounded-full transition-all duration-100"
                    style={{ width: `${progress}%` }}
                  />
                </div>
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default HandVisualizer;