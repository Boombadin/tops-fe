import React from "react"
import PropTypes from "prop-types"
import { Image } from "semantic-ui-react"
import { PROMOTYPE as PromoIconType } from "../../types"
const PromoBadge = ({ type, title, imgPromo }) => {
  if (type === PromoIconType.IMAGE) {
    return <Image src={imgPromo} size="mini" />
  } else {
    return <span>{title}</span>
  }
}

PromoBadge.PropTypes = {
  title: PropTypes.string,
  imgPromo: PropTypes.string,
  type: PropTypes.string
}
PromoBadge.defaultProps = {
  title: "",
  imgPromo: "",
  type: "image"
}

export default PromoBadge
