import styled from 'styled-components'
import posed from 'react-pose'
import { tween } from 'popmotion'

const ImageAnimated = posed.div({
  enter: {
    opacity: 1,
    scale: 1,
    transition: tween,
  },
  exit: {
    opacity: 0,
    scale: 0.5,
    transition: tween
  }
});

export const ImageBackground = styled(ImageAnimated)`
  background-image: url('${props => props.src}');
  background-repeat: no-repeat;
  background-size: contain;
  width: ${props => props.size[0]};
  height: ${props => props.size[1] || props.size[0]};
  margin: ${props => props.margin || 0};
  padding: ${props => props.padding || 0};
  overflow: hidden;
`
