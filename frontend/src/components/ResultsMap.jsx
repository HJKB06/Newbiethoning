import { useMemo, useState } from "react";
import { Minus, Plus, RotateCcw } from "lucide-react";

const LOCATIONS = {
  안암동: { x: 49, y: 29 },
  회기동: { x: 69, y: 20 },
  성수동: { x: 70, y: 51 },
  신림동: { x: 31, y: 74 },
};

// The map is a Seoul-focused schematic, so convert backend coordinates
// into percentages inside a stable Seoul bounding box.
const SEOUL_BOUNDS = {
  minLat: 37.45,
  maxLat: 37.70,
  minLng: 126.82,
  maxLng: 127.18,
};

function getMapPosition(area) {
  if (area.lat != null && area.lng != null) {
    return {
      x:
        ((area.lng - SEOUL_BOUNDS.minLng) /
          (SEOUL_BOUNDS.maxLng - SEOUL_BOUNDS.minLng)) *
        100,
      y:
        ((SEOUL_BOUNDS.maxLat - area.lat) /
          (SEOUL_BOUNDS.maxLat - SEOUL_BOUNDS.minLat)) *
        100,
    };
  }

  return LOCATIONS[area.name] ?? { x: 50, y: 50 };
}

function zoomCoordinate(value, zoom) {
  return 50 + (value - 50) * zoom;
}

function distance(a, b) {
  const dx = a.x - b.x;
  const dy = a.y - b.y;

  return Math.sqrt(dx * dx + dy * dy);
}

/*
  Automatically spreads markers that are too close together.

  Uses a golden-angle spiral so even 10–20 markers
  sitting at the exact same coordinate can be separated.
*/
function buildMarkerPositions(results, zoom) {
  const markers = results.map((area, index) => {
    const base = getMapPosition(area);

    return {
      area,
      index,
      base,
      x: zoomCoordinate(base.x, zoom),
      y: zoomCoordinate(base.y, zoom),
    };
  });

  const processed = new Set();

  for (let i = 0; i < markers.length; i += 1) {
    if (processed.has(i)) continue;

    const group = [i];

    for (let j = i + 1; j < markers.length; j += 1) {
      if (
        distance(markers[i].base, markers[j].base) <
        5
      ) {
        group.push(j);
      }
    }

    group.forEach((index) => processed.add(index));

    if (group.length <= 1) continue;

    group.forEach((markerIndex, groupIndex) => {
      /*
        Keep the first marker near the original location.
        Other markers spiral outward.

        Higher zoom = greater separation.
      */

      if (groupIndex === 0) {
        return;
      }

      const angle =
        groupIndex * 137.5 * (Math.PI / 180);

      const baseRadius =
        3.3 * Math.sqrt(groupIndex);

      const zoomSpread =
        0.8 + zoom * 0.7;

      const radius =
        baseRadius * zoomSpread;

      markers[markerIndex].x +=
        Math.cos(angle) * radius;

      markers[markerIndex].y +=
        Math.sin(angle) * radius;
    });
  }

  return markers.map((marker) => ({
    ...marker,

    // Prevent markers from disappearing outside the map.
    x: Math.max(4, Math.min(96, marker.x)),
    y: Math.max(6, Math.min(94, marker.y)),
  }));
}

function ResultsMap({
  results,
  activeName,
  onSelect,
}) {
  const activeArea =
    results.find(
      (area) => area.name === activeName
    ) ?? results[0];

  const [zoom, setZoom] = useState(1);

  const markers = useMemo(
    () => buildMarkerPositions(results, zoom),
    [results, zoom]
  );

  const zoomIn = () => {
    setZoom((current) =>
      Math.min(current + 0.25, 3)
    );
  };

  const zoomOut = () => {
    setZoom((current) =>
      Math.max(current - 0.25, 1)
    );
  };

  const resetZoom = () => {
    setZoom(1);
  };

  return (
    <section
      className="results-map-panel"
      aria-label="Recommended neighborhoods map"
    >
      <div className="map-heading">
        <span>SEOUL · TOP MATCHES</span>

        <div className="map-heading-right">
          <span>서울특별시</span>

          <span className="map-zoom-indicator">
            {Math.round(zoom * 100)}%
          </span>
        </div>
      </div>

      <div className="results-map">
        {/* ZOOM CONTROLS */}
        <div className="map-controls">
          <button
            type="button"
            onClick={zoomIn}
            disabled={zoom >= 3}
            aria-label="Zoom in"
            title="Zoom in"
          >
            <Plus
              size={16}
              strokeWidth={1.8}
            />
          </button>

          <button
            type="button"
            onClick={zoomOut}
            disabled={zoom <= 1}
            aria-label="Zoom out"
            title="Zoom out"
          >
            <Minus
              size={16}
              strokeWidth={1.8}
            />
          </button>

          <button
            type="button"
            onClick={resetZoom}
            disabled={zoom === 1}
            aria-label="Reset zoom"
            title="Reset zoom"
          >
            <RotateCcw
              size={14}
              strokeWidth={1.8}
            />
          </button>
        </div>

        {/* MAP BACKGROUND */}
        <div
          className="map-background-layer"
          style={{
            transform: `scale(${zoom})`,
          }}
        >
          <div className="river river-one" />
          <div className="river river-two" />
        </div>

        {/* MARKERS */}
        <div className="map-markers-layer">
          {markers.map(
            ({
              area,
              index,
              x,
              y,
            }) => (
              <div
                className="map-marker-position"
                style={{
                  left: `${x}%`,
                  top: `${y}%`,
                }}
                key={area.name}
              >
                <button
                  className={`result-marker${
                    activeArea?.name === area.name
                      ? " active"
                      : ""
                  }`}
                  type="button"
                  onClick={() =>
                    onSelect(area.name)
                  }
                  aria-label={`#${
                    index + 1
                  } ${area.name}, LifeFit score ${
                    area.score
                  }`}
                >
                  <span>{index + 1}</span>

                  <strong>
                    {area.name}
                  </strong>
                </button>
              </div>
            )
          )}
        </div>
      </div>

      {activeArea ? (
        <div
          className="map-selection"
          aria-live="polite"
        >
          <div>
            <span>Selected area</span>
            <strong>
              {activeArea.name}
            </strong>
          </div>

          <div>
            <span>LifeFit score</span>
            <strong>
              {activeArea.score}
            </strong>
          </div>

          <div>
            <span>Monthly rent</span>
            <strong>
              ₩
              {activeArea.rent.toLocaleString()}
            </strong>
          </div>

          <div>
            <span>Commute</span>
            <strong>
              {activeArea.commute} min
            </strong>
          </div>
        </div>
      ) : null}
    </section>
  );
}

export default ResultsMap;
