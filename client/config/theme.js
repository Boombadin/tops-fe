const theme = {
  // Logo
  logo: '/images/logo.svg',
  // Font
  fontFamily: 'db_heavent',
  fontSize: '16px',
  // Responsive Breakpoint
  breakpoints: {
    xs: 0,
    sm: 576,
    md: 769,
    lg: 1024,
    xl: 1200,
  },
  // Container
  container: {
    maxWidth: 1280,
    padding: {
      xs: '0',
      md: '0 12px',
      lg: '0 20px',
      xl: '0 50px',
    },
  },
  // Button
  btnHeight: 40,
  btn: {
    primary: '#854ba2',
    danger: '#ec1d24',
    warning: '#f47920',
    success: '#199000',
    default: '#333333',
  },
  btnHover: {
    primary: '#5f267e',
    danger: '#EE2222',
    warning: '#e36810',
    success: '#229922',
    default: 'transparent',
  },
  text: {
    primary: '#2A2A2A',
    danger: '#ec1d24',
    warning: '#ff8e00',
    success: '#199000',
    default: '#2A2A2A',
  },
  color: {
    primary: '#331245',
    danger: '#e02b27',
    warning: '#FF9900',
    success: '#4ba918',
    default: '#2A2A2A',
  },
  inputStyle: props => `
    font-size: 18px;
    border-radius: 0;
    height: 35px;
    border-color: #d8d8d8;
    position: relative;
    &:focus{
      background-color: rgba(135,178,199,0.09);
      border: 1px solid #87b2c7;
    }
    &:hover {
      background-color: white;
      border-color:#939598;
    }
    ${props &&
      props.error &&
      `
      border-color: #f36b7c;
      & + div {
        width: 100%;
      }
      & + div:after {
        content: ' ';
        display: inline-block;
        position: absolute;
        width:20px;
        height:20px;
        top: -27px;
        right: 11px;
        background: url(/icons/incorrect.svg) no-repeat 97% center;
      }
    `}

    ${props &&
      props.success &&
      `
      border-color: green;
      & + div {
        width: 100%;
      }
      & + div:after {
        content: ' ';
        display: inline-block;
        position: absolute;
        width:18px;
        height:18px;
        top: -26px;
        right: 10px;
        background: url(/icons/correct.svg) no-repeat 97% center;
      }
    `}

    ${props && props.inputStyle}
  `,
  textAreaStyle: props => `
    font-size: 18px;
    border-radius: 0;
    height: 100px;
    border-color: #d8d8d8;
    position: relative;
    &:focus{
      background-color: rgba(135,178,199,0.09);
      border: 1px solid #87b2c7;
    }
    &:hover {
      background-color: white;
      border-color:#939598;
    }
    ${props &&
      props.error &&
      `
      border-color: #f36b7c;
      & + div {
        width: 100%;
      }
      & + div:after {
        content: ' ';
        display: inline-block;
        position: absolute;
        width:20px;
        height:20px;
        top: -27px;
        right: 11px;
        background: url(/icons/incorrect.svg) no-repeat 97% center;
      }
    `}

    ${props &&
      props.success &&
      `
      border-color: green;
      & + div {
        width: 100%;
      }
      & + div:after {
        content: ' ';
        display: inline-block;
        position: absolute;
        width:20px;
        height:20px;
        top: -26px;
        right: 10px;
        background: url(/icons/correct.svg) no-repeat 97% center;
      }
    `}

    ${props && props.inputStyle}
  `,
};

export default theme;
