/* ==========================================================================
   PVA · RO-BIT, el robot guía
   Robot pequeño blanco/gris, pantalla negra, ojos cian y antena. Las poses
   acompañan momentos pedagógicos concretos; no se repite como decoración.
   ========================================================================== */
(function (global) {
  "use strict";

  var PVA = global.PVA;

  var TURQ = "#4fe0c1";
  var LAV = "#c9b8ff";
  var CORAL = "#ff8f82";
  var YELLOW = "#ffd166";

  var POSES = {
    welcome: {
      arms: ["down", "up"],
      eyes: "happy",
      mouth: "smile",
      tilt: -4,
      accent: TURQ,
      sparkles: true,
      label: "saludando"
    },
    explain: {
      arms: ["down", "out"],
      eyes: "normal",
      mouth: "smile",
      tilt: 0,
      accent: TURQ,
      sparkles: false,
      label: "explicando"
    },
    warning: {
      arms: ["up", "up"],
      eyes: "narrow",
      mouth: "flat",
      tilt: 0,
      accent: CORAL,
      sparkles: false,
      label: "advirtiendo"
    },
    reflection: {
      arms: ["down", "chin"],
      eyes: "up",
      mouth: "tiny",
      tilt: 5,
      accent: LAV,
      sparkles: false,
      label: "reflexionando"
    },
    feedback: {
      arms: ["down", "out"],
      eyes: "normal",
      mouth: "bigSmile",
      tilt: -2,
      accent: TURQ,
      sparkles: false,
      label: "dando retroalimentación"
    },
    celebration: {
      arms: ["up", "up"],
      eyes: "happy",
      mouth: "bigSmile",
      tilt: 0,
      accent: YELLOW,
      sparkles: true,
      label: "celebrando"
    }
  };

  var ARM_PATHS = {
    down: {
      left: "M60 148 C48 160 44 176 46 192",
      right: "M140 148 C152 160 156 176 154 192",
      hands: [[46, 192], [154, 192]]
    },
    out: {
      left: "M60 148 C44 146 34 140 24 130",
      right: "M140 148 C156 146 166 140 176 130",
      hands: [[24, 130], [176, 130]]
    },
    up: {
      left: "M60 146 C44 138 36 118 32 100",
      right: "M140 146 C156 138 164 118 168 100",
      hands: [[32, 100], [168, 100]]
    },
    chin: {
      left: "M60 150 C50 150 50 136 58 126",
      right: "M140 148 C152 150 150 134 134 131",
      hands: [[58, 126], [134, 131]]
    }
  };

  function glow(cx, cy, r, color, opacity) {
    return '<circle cx="' + cx + '" cy="' + cy + '" r="' + r + '" fill="' + color +
      '" opacity="' + (opacity || 0.16) + '"/>';
  }

  function eyes(kind, color) {
    if (kind === "happy") {
      return (
        '<g class="eye">' + glow(82, 84, 11, color, 0.14) +
          '<path d="M75 85 Q82 76 89 85" fill="none" stroke="' + color +
          '" stroke-width="4.2" stroke-linecap="round"/>' +
        "</g>" +
        '<g class="eye">' + glow(118, 84, 11, color, 0.14) +
          '<path d="M111 85 Q118 76 125 85" fill="none" stroke="' + color +
          '" stroke-width="4.2" stroke-linecap="round"/>' +
        "</g>"
      );
    }

    if (kind === "narrow") {
      return (
        '<g class="eye">' + glow(82, 83, 11, color, 0.14) +
          '<rect x="75" y="80.5" width="14" height="5" rx="2.5" fill="' + color + '"/>' +
        "</g>" +
        '<g class="eye">' + glow(118, 83, 11, color, 0.14) +
          '<rect x="111" y="80.5" width="14" height="5" rx="2.5" fill="' + color + '"/>' +
        "</g>"
      );
    }

    if (kind === "up") {
      return (
        '<g class="eye">' + glow(82, 84, 11, color, 0.14) +
          '<ellipse cx="82" cy="78.5" rx="4.6" ry="6.2" fill="' + color + '"/>' +
          '<circle cx="80.4" cy="76.4" r="1.5" fill="#ffffff" opacity=".75"/>' +
        "</g>" +
        '<g class="eye">' + glow(118, 84, 11, color, 0.14) +
          '<ellipse cx="118" cy="78.5" rx="4.6" ry="6.2" fill="' + color + '"/>' +
          '<circle cx="116.4" cy="76.4" r="1.5" fill="#ffffff" opacity=".75"/>' +
        "</g>"
      );
    }

    return (
      '<g class="eye">' + glow(82, 83, 11, color, 0.14) +
        '<ellipse cx="82" cy="83" rx="4.6" ry="6.2" fill="' + color + '"/>' +
        '<circle cx="80.5" cy="81" r="1.4" fill="#ffffff" opacity=".7"/>' +
      "</g>" +
      '<g class="eye">' + glow(118, 83, 11, color, 0.14) +
        '<ellipse cx="118" cy="83" rx="4.6" ry="6.2" fill="' + color + '"/>' +
        '<circle cx="116.5" cy="81" r="1.4" fill="#ffffff" opacity=".7"/>' +
      "</g>"
    );
  }

  function mouth(kind, color) {
    if (kind === "bigSmile") {
      return '<path d="M89 98 Q100 112 111 98" fill="none" stroke="' + color +
        '" stroke-width="4" stroke-linecap="round"/>';
    }
    if (kind === "flat") {
      return '<path d="M93 102 H107" fill="none" stroke="#a9b8d6" stroke-width="3.6" stroke-linecap="round"/>';
    }
    if (kind === "tiny") {
      return '<path d="M96 101 Q100 104 104 101" fill="none" stroke="' + color +
        '" stroke-width="2.8" stroke-linecap="round"/>';
    }
    return '<path d="M92 99 Q100 106 108 99" fill="none" stroke="' + color +
      '" stroke-width="3.2" stroke-linecap="round"/>';
  }

  function sparkle(x, y, size, color) {
    var a = size * 0.28;
    return '<path d="M' + x + ' ' + (y - size) +
      " L" + (x + a) + " " + (y - a) +
      " L" + (x + size) + " " + y +
      " L" + (x + a) + " " + (y + a) +
      " L" + x + " " + (y + size) +
      " L" + (x - a) + " " + (y + a) +
      " L" + (x - size) + " " + y +
      " L" + (x - a) + " " + (y - a) +
      ' Z" fill="' + color + '" opacity=".85"/>';
  }

  function build(pose) {
    var cfg = POSES[pose] || POSES.explain;
    var accent = cfg.accent;
    var arms = ARM_PATHS[cfg.arms[1]];

    var parts = [];

    parts.push(
      '<ellipse cx="100" cy="207" rx="47" ry="7.5" fill="' + accent + '" opacity=".1"/>'
    );

    /* Antena */
    parts.push(
      '<line x1="100" y1="28" x2="100" y2="48" stroke="#c6d2e8" stroke-width="3.2" stroke-linecap="round"/>' +
      '<circle class="antenna-tip" cx="100" cy="23" r="13" fill="' + accent + '" opacity=".16"/>' +
      '<circle cx="100" cy="23" r="6.4" fill="' + accent + '"/>' +
      '<circle cx="98" cy="21" r="1.8" fill="#ffffff" opacity=".75"/>'
    );

    /* Cuello y cuerpo */
    parts.push(
      '<rect x="90" y="120" width="20" height="16" rx="7" fill="#c5d0e5"/>'
    );
    parts.push(
      '<rect x="58" y="132" width="84" height="62" rx="26" fill="#e9effb" stroke="#bcc8e0" stroke-width="2"/>' +
      '<rect x="78" y="150" width="44" height="26" rx="13" fill="#080d1a" stroke="' + accent + '" stroke-opacity=".38" stroke-width="1.4"/>' +
      '<circle cx="100" cy="163" r="10" fill="' + accent + '" opacity=".14"/>' +
      '<circle cx="100" cy="163" r="4.8" fill="' + accent + '"/>' +
      '<circle cx="66" cy="143" r="2.4" fill="#c2cde3"/>' +
      '<circle cx="134" cy="143" r="2.4" fill="#c2cde3"/>'
    );

    /* Brazos (delante del torso, detrás de la cabeza) */
    parts.push(
      '<path d="' + arms.left + '" fill="none" stroke="#d8e0f1" stroke-width="11" stroke-linecap="round"/>' +
      '<path d="' + arms.right + '" fill="none" stroke="#d8e0f1" stroke-width="11" stroke-linecap="round"/>' +
      '<circle cx="' + arms.hands[0][0] + '" cy="' + arms.hands[0][1] + '" r="7" fill="#c9d5ea" stroke="#b3c0da" stroke-width="1.2"/>' +
      '<circle cx="' + arms.hands[1][0] + '" cy="' + arms.hands[1][1] + '" r="7" fill="#c9d5ea" stroke="#b3c0da" stroke-width="1.2"/>'
    );

    /* Cabeza */
    parts.push(
      '<g transform="rotate(' + cfg.tilt + ' 100 86)">' +
        '<rect x="46" y="38" width="108" height="88" rx="30" fill="#f1f5fe" stroke="#c3cee4" stroke-width="2"/>' +
        '<rect x="40" y="66" width="7" height="24" rx="3.5" fill="#c9d4e8"/>' +
        '<rect x="153" y="66" width="7" height="24" rx="3.5" fill="#c9d4e8"/>' +
        '<rect x="57" y="52" width="86" height="62" rx="20" fill="#070b18" stroke="' + accent + '" stroke-opacity=".4" stroke-width="1.5"/>' +
        '<path d="M67 62 Q79 55 95 58" fill="none" stroke="#ffffff" stroke-opacity=".22" stroke-width="3" stroke-linecap="round"/>' +
        '<circle cx="100" cy="45.5" r="2" fill="' + accent + '" opacity=".8"/>' +
        '<circle cx="70" cy="104" r="3" fill="' + accent + '" opacity=".16"/>' +
        '<circle cx="130" cy="104" r="3" fill="' + accent + '" opacity=".16"/>' +
        eyes(cfg.eyes, TURQ) +
        mouth(cfg.mouth, TURQ) +
      "</g>"
    );

    if (cfg.sparkles) {
      parts.push(
        sparkle(164, 58, 7, accent) +
        sparkle(35, 88, 5, accent) +
        (pose === "celebration" ? sparkle(150, 32, 5.5, accent) + sparkle(46, 52, 4, accent) : "")
      );
    }

    return '<svg viewBox="0 0 200 220" aria-hidden="true" focusable="false">' +
      parts.join("") +
      "</svg>";
  }

  function svg(pose, opts) {
    var options = opts || {};
    var cfg = POSES[pose] || POSES.explain;
    var classes = "robot";
    if (options.float) classes += " robot--float";
    if (options.className) classes += " " + options.className;
    var label = options.label || ("RO-BIT, robot guía " + cfg.label);
    return '<span class="' + classes + '" role="img" aria-label="' + label + '">' +
      build(POSES[pose] ? pose : "explain") +
      "</span>";
  }

  function bubble(pose, html, kind) {
    var cls = "robot-bubble";
    if (kind === "warn" || kind === "warning") cls += " robot-bubble--warn";
    if (kind === "alert") cls += " robot-bubble--alert";
    return '<div class="' + cls + '">' +
      svg(pose, { className: "robot--small" }) +
      '<div class="robot-bubble__body"><b>RO-BIT</b><div>' + html + "</div></div>" +
      "</div>";
  }

  PVA.robot = {
    POSES: POSES,
    svg: svg,
    bubble: bubble
  };
})(window);
