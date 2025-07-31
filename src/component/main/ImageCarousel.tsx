import React, { useState } from 'react';
import { Box, Button, MobileStepper } from '@mui/material';
import { KeyboardArrowLeft, KeyboardArrowRight } from '@mui/icons-material';

const images = [
  { label: 'img1', path: '/img/sample-img/img1.jpg' },
  { label: 'img2', path: '/img/sample-img/img2.jpg' },
  { label: 'img3', path: '/img/sample-img/img3.jpg' },
  { label: 'img4', path: '/img/sample-img/img4.jpg' },
  { label: 'img5', path: '/img/sample-img/img5.jpg' },
];

const ImageCarousel: React.FC = () => {
  const [activeStep, setActiveStep] = useState(0);
  const maxSteps = images.length;

  const handleNext = () => setActiveStep((prev) => Math.min(prev + 1, maxSteps - 1));
  const handleBack = () => setActiveStep((prev) => Math.max(prev - 1, 0));

  return (
      <Box sx={{ maxWidth: 605, height: 440, bgcolor: '#222', position: 'relative' }}>
        {/* ✅ 조건부 렌더링 */}
        <Box
            component="img"
            src={images[activeStep].path}
            alt={images[activeStep].label}
            sx={{
              width: '100%',
              height: '100%',
              objectFit: 'cover',
              transition: 'opacity 0.5s ease-in-out',
            }}
        />

        <MobileStepper
            steps={maxSteps}
            position="static"
            activeStep={activeStep}
            sx={{
              position: 'absolute',
              bottom: 0,
              width: '100%',
              bgcolor: '#222',
            }}
            nextButton={
              <Button size="small" onClick={handleNext} disabled={activeStep === maxSteps - 1}>
                다음
                <KeyboardArrowRight />
              </Button>
            }
            backButton={
              <Button size="small" onClick={handleBack} disabled={activeStep === 0}>
                <KeyboardArrowLeft />
                이전
              </Button>
            }
        />
      </Box>
  );
};

export default ImageCarousel;
