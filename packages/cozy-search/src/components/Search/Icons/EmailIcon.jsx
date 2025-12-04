import React from 'react'

// TODO: should be moved in cozy-ui
const EmailIcon = () => {
  return (
    <svg
      width="32"
      height="32"
      viewBox="0 0 32 32"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <rect
        y="-0.00012207"
        width="32"
        height="32"
        rx="10.5681"
        fill="url(#paint0_linear_12591_86)"
      />
      <g filter="url(#filter0_d_12591_86)">
        <path
          fillRule="evenodd"
          clipRule="evenodd"
          d="M6.58473 11.7736C5.82869 12.3502 5.38501 13.2465 5.38501 14.1973V22.8973C5.38501 24.9174 7.02262 26.555 9.04272 26.555H22.9405C24.9606 26.555 26.5982 24.9174 26.5982 22.8973V14.1973C26.5982 13.2465 26.1545 12.3502 25.3984 11.7736L17.84 6.00938C16.7483 5.17688 15.2349 5.17688 14.1432 6.00939L6.58473 11.7736ZM7.74203 13.8441V23.0247C7.74203 23.6981 8.2879 24.2439 8.96126 24.2439H23.0219C23.6953 24.2439 24.2412 23.6981 24.2412 23.0247V13.8441L17.3904 18.6421C16.5506 19.2302 15.4326 19.2302 14.5927 18.6421L7.74203 13.8441Z"
          fill="white"
        />
      </g>
      <defs>
        <filter
          id="filter0_d_12591_86"
          x="3.75323"
          y="4.07958"
          width="24.4767"
          height="24.4336"
          filterUnits="userSpaceOnUse"
          colorInterpolationFilters="sRGB"
        >
          <feFlood floodOpacity="0" result="BackgroundImageFix" />
          <feColorMatrix
            in="SourceAlpha"
            type="matrix"
            values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0"
            result="hardAlpha"
          />
          <feOffset dy="0.326356" />
          <feGaussianBlur stdDeviation="0.815891" />
          <feComposite in2="hardAlpha" operator="out" />
          <feColorMatrix
            type="matrix"
            values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.1 0"
          />
          <feBlend
            mode="normal"
            in2="BackgroundImageFix"
            result="effect1_dropShadow_12591_86"
          />
          <feBlend
            mode="normal"
            in="SourceGraphic"
            in2="effect1_dropShadow_12591_86"
            result="shape"
          />
        </filter>
        <linearGradient
          id="paint0_linear_12591_86"
          x1="4.4874"
          y1="28.6376"
          x2="31.2486"
          y2="1.55007"
          gradientUnits="userSpaceOnUse"
        >
          <stop stopColor="#1E91FF" />
          <stop offset="0.997303" stopColor="#2ED9FF" />
        </linearGradient>
      </defs>
    </svg>
  )
}

export default EmailIcon
