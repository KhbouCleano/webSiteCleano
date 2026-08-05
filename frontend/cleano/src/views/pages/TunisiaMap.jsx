    // ============================================================
    // src/views/components/TunisiaMap.jsx
    // Place tunisia-governorats.svg in /public/
    // ============================================================
    import { useEffect, useRef, useState } from "react";

    const C = {
      navy:    "#1B2559",
      magenta: "#E7398B",
      rose:    "#FBCFE8",
      gray:    "#94A3B8",
      grayHov: "#CBD5E1",
      white:   "#FFFFFF",
    };

    const TunisiaMap = ({ selected, hovered, onSelect, onHover, onLeave }) => {
      const containerRef = useRef(null);
      const svgRef       = useRef(null);
      const [ping, setPing] = useState(null);

      // IDs des 24 gouvernorats dans le SVG
      const GOV_IDS = [
        "tataouine","mednine","zaghouan","gafsa","kebili",
        "sididouzid","kasserine","siliana","sfax","mahdia",
        "monastir","sousse","nabeul","benarous","tunis",
        "ariana","bizerte","lekef","beja","kairouan",
        "tozeur","jendouba","manouba",
      ];

      // Charger le SVG inline via fetch
      useEffect(() => {
        const container = containerRef.current;
        if (!container) return;

        fetch("/tunisia-governorats.svg")
          .then((r) => r.text())
          .then((svgText) => {
            container.innerHTML = svgText;
            const svg = container.querySelector("svg");
            if (!svg) return;
            svgRef.current = svg;

            // Adapter le SVG au container - PLUS GRAND
            svg.removeAttribute("width");
            svg.removeAttribute("height");
            svg.style.width  = "100%";
            svg.style.height = "auto";
            svg.style.display = "block";

            // Agrandir la carte
            svg.style.transform = "scale(1.1)";
            svg.style.transformOrigin = "center center";
            svg.style.transition = "transform 0.3s ease";

            // Supprimer le watermark copyright
            const copyright = svg.querySelector("#Copyright");
            if (copyright) copyright.style.display = "none";

            // Appliquer styles de base à tous les paths gouvernorats
            GOV_IDS.forEach((id) => {
              const path = svg.querySelector(`#${id}`);
              if (!path) return;

              // Style de base
              path.style.fill       = C.gray;
              path.style.stroke     = C.white;
              path.style.strokeWidth = "1";
              path.style.cursor     = "pointer";
              path.style.transition = "fill .2s ease, filter .2s ease, transform .2s ease";

              // Événements
              path.addEventListener("mouseenter", () => onHover(id));
              path.addEventListener("mouseleave", onLeave);
              path.addEventListener("click", () => {
                // Effet de ping
                setPing(id);
                setTimeout(() => setPing(null), 1000);
                onSelect(id);
              });
            });
          });

        return () => {
          container.innerHTML = "";
        };
      }, []); // mount once

      // Mettre à jour les couleurs quand selected/hovered change
      useEffect(() => {
        const svg = svgRef.current;
        if (!svg) return;

        GOV_IDS.forEach((id) => {
          const path = svg.querySelector(`#${id}`);
          if (!path) return;

          if (id === selected) {
            path.style.fill   = C.magenta;
            path.style.filter = "drop-shadow(0 2px 6px rgba(231,57,139,0.4))";
            path.style.strokeWidth = "1.5";
          } else if (id === hovered) {
            path.style.fill   = C.rose;
            path.style.filter = "drop-shadow(0 1px 3px rgba(0,0,0,0.2))";
            path.style.strokeWidth = "1.2";
          } else {
            path.style.fill   = C.gray;
            path.style.filter = "none";
            path.style.strokeWidth = "1";
          }
        });
      }, [selected, hovered]);

      // Gestion du ping (effet d'onde)
      useEffect(() => {
        const svg = svgRef.current;
        if (!svg || !ping) return;

        const path = svg.querySelector(`#${ping}`);
        if (!path) return;

        // Créer un élément d'onde
        const wave = document.createElement("div");
        wave.className = "ping-wave";
        wave.style.cssText = `
          position: absolute;
          border-radius: 50%;
          background: rgba(231, 57, 139, 0.3);
          width: 40px;
          height: 40px;
          pointer-events: none;
          animation: pingAnim 1s ease-out forwards;
          z-index: 10;
        `;

        // Positionner l'onde au centre du path
        const bbox = path.getBBox();
        const container = svg.parentElement;
        const rect = container.getBoundingClientRect();

        wave.style.left = (bbox.x + bbox.width/2) + "px";
        wave.style.top = (bbox.y + bbox.height/2) + "px";
        wave.style.transform = "translate(-50%, -50%)";

        container.style.position = "relative";
        container.appendChild(wave);

        // Nettoyer après animation
        setTimeout(() => wave.remove(), 1000);
      }, [ping]);

      return (
        <div
          ref={containerRef}
          style={{
            width: "100%",
            maxWidth: 520,  // Augmenté de 420 à 520
            margin: "0 auto",
            position: "relative"
          }}
        />
      );
    };

    export default TunisiaMap;