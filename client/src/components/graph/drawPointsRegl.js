import { glPointFlags, glPointSize } from "../../util/glHelpers";

export default function(regl) {
  return regl({
    vert: `
    precision mediump float;

    attribute vec2 position;
    attribute vec3 color;
    attribute float flag;

    uniform float distance;
    uniform mat3 projView;
    uniform float nPoints;
    uniform float minViewportDimension;

    varying vec4 fragColor;

    const float zBottom = 0.99;
    const float zMiddle = 0.;
    const float zTop = -1.;

    // import getFlags()
    ${glPointFlags}

    // get pointSize()
    ${glPointSize}

    void main() {
      bool isNaN, isSelected, isHighlight;
      getFlags(flag, isNaN, isSelected, isHighlight);

      float size = pointSize(nPoints, minViewportDimension, isSelected, isHighlight);
      gl_PointSize = size * pow(distance, 0.5);

      float z = isNaN ? zBottom : (isHighlight ? zTop : zMiddle);
      vec3 xy = projView * vec3(position, 1.);
      gl_Position = vec4(xy.xy, z, 1.);

      float alpha = isNaN ? 0.9 : 1.0;
      fragColor = vec4(color, alpha);
    }`,

    frag: `
    precision mediump float;
    varying vec4 fragColor;
    void main() {
      if (length(gl_PointCoord.xy - 0.5) > 0.5) {
        discard;
      }
      gl_FragColor = fragColor;
    }`,

    attributes: {
      position: regl.prop("position"),
      color: regl.prop("color"),
      flag: regl.prop("flag")
    },

    uniforms: {
      distance: regl.prop("distance"),
      projView: regl.prop("projView"),
      nPoints: regl.prop("nPoints"),
      minViewportDimension: regl.prop("minViewportDimension")
    },

    count: regl.prop("count"),

    primitive: "points"
  });
}
