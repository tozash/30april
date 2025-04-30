import React, { useEffect, useRef, useState } from 'react';
import { loadHandposeModel, detectHandPoseFromLandmarks, HandPose } from '../utils/HandPose';

const HandVisualizer: React.FC = () => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [handPose, setHandPose] = useState<HandPose>(null);
  const [detectedPose, setDetectedPose] = useState<HandPose>(null);
  const [isCooldown, setIsCooldown] = useState(false);
  const [cooldownTime, setCooldownTime] = useState(3);
  const cooldownRef = useRef<NodeJS.Timeout | null>(null);
  const cooldownIntervalRef = useRef<NodeJS.Timeout | null>(null);

  // Hand connections for drawing lines
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

  const startCooldown = (pose: HandPose) => {
    if (isCooldown) return;
    
    setDetectedPose(pose);
    setIsCooldown(true);
    setCooldownTime(3);
    
    // Update cooldown time every second
    cooldownIntervalRef.current = setInterval(() => {
      setCooldownTime(prev => {
        if (prev <= 1) {
          if (cooldownIntervalRef.current) {
            clearInterval(cooldownIntervalRef.current);
          }
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    
    // End cooldown after 3 seconds
    cooldownRef.current = setTimeout(() => {
      setIsCooldown(false);
      setDetectedPose(null);
      setCooldownTime(3);
    }, 3000);
  };

  useEffect(() => {
    let model: any;
    let animationFrameId: number;

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
      HAND_CONNECTIONS.slice(-7).forEach(([i, j]) => {
        ctx.beginPath();
        ctx.moveTo(landmarks[i][0], landmarks[i][1]);
        ctx.lineTo(landmarks[j][0], landmarks[j][1]);
        ctx.stroke();
      });

      // Draw finger connections (thinner lines)
      ctx.lineWidth = 2;
      HAND_CONNECTIONS.slice(0, -7).forEach(([i, j]) => {
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
        
        // Draw hand visualization
        drawHand(ctx, landmarks);
      } else {
        setHandPose(null);
        // Clear canvas when no hand is detected
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        if (videoRef.current) {
          ctx.drawImage(videoRef.current, 0, 0, canvas.width, canvas.height);
        }
      }

      animationFrameId = requestAnimationFrame(detectHandPose);
    };

    const initialize = async () => {
      await setupCamera();
      model = await loadHandposeModel();
      detectHandPose();
    };

    initialize();

    return () => {
      if (animationFrameId) {
        cancelAnimationFrame(animationFrameId);
      }
      if (videoRef.current?.srcObject) {
        const stream = videoRef.current.srcObject as MediaStream;
        stream.getTracks().forEach(track => track.stop());
      }
    };
  }, []);

  useEffect(() => {
    // Start cooldown when any hand pose is detected
    if (handPose !== null && !isCooldown) {
      startCooldown(handPose);
    }
    
    return () => {
      if (cooldownRef.current) {
        clearTimeout(cooldownRef.current);
      }
      if (cooldownIntervalRef.current) {
        clearInterval(cooldownIntervalRef.current);
      }
    };
  }, [handPose, isCooldown]);

  return (
    <div className="relative w-full max-w-md mx-auto">
      <video
        ref={videoRef}
        autoPlay
        playsInline
        muted
        className="w-full rounded-lg shadow-lg"
        style={{ transform: 'scaleX(-1)' }}
      />
      <canvas
        ref={canvasRef}
        className="absolute top-0 left-0 w-full h-full"
        style={{ transform: 'scaleX(-1)' }}
      />
      {handPose && (
        <div className="absolute top-4 left-4 bg-white bg-opacity-75 px-4 py-2 rounded-lg">
          <p className="text-lg font-semibold">Detected: {handPose}</p>
        </div>
      )}

      {/* Cooldown Timer Display */}


    </div>
  );
};

export default HandVisualizer;