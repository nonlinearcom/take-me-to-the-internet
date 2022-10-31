const breakpoints = useBreakpoints({
	mobile: 768,
	tablet: 1024,
	laptop: 1200,
	desktop: 1280,
	desktopL: 1440,
	desktopXL: 1600,
})

export function useMyBreakpoints() {



	const isMobile = breakpoints.smaller('mobile')
	const isTablet = breakpoints.smaller('tablet')
	// const tablet = breakpoints.between('mobile', 'tablet')
	// laptop.value = breakpoints.greater('tablet')
	const isLaptop = breakpoints.greater('tablet')
	const isDesktop = breakpoints.greater('desktop')
	const isDesktopL = breakpoints.greater('desktopL')
	const isDesktopXL = breakpoints.greater('desktopXL')


	return {
		isMobile,
		isTablet,
		isLaptop,
		isDesktop,
		isDesktopL,
		isDesktopXL,
	}
}
