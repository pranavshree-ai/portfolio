// 198 frames of the 3D blooming magnolia flower model downloaded locally from yaros.me
const TOTAL_FRAMES = 198;

const MODEL_FRAMES = Array.from({ length: TOTAL_FRAMES }, (_, i) => 
  `/images/flower/frame_${String(i).padStart(4, '0')}.webp`
);

export default MODEL_FRAMES;
