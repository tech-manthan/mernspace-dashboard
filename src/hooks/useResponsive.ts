import { useMediaQuery } from "react-responsive";

export const useResponsive = () => {
  const isMobile = useMediaQuery({
    maxWidth: 640,
  });
  const isTablet = useMediaQuery({
    minWidth: 640,
    maxWidth: 1024,
  });
  const isLaptop = useMediaQuery({
    minWidth: 1024,
    maxWidth: 1280,
  });
  const isDesktop = useMediaQuery({
    minWidth: 1280,
    maxWidth: 1536,
  });

  const isBigScreen = useMediaQuery({
    minWidth: 1536,
  });
  const isPortrait = useMediaQuery({ orientation: "portrait" });
  const isRetina = useMediaQuery({ minResolution: "2dppx" });

  return {
    isMobile,
    isTablet,
    isLaptop,
    isDesktop,
    isBigScreen,
    isPortrait,
    isRetina,
  };
};
