# GridGhost Plan

## Summary
Build a React + Vite web app for simulated racing telemetry. The app has a homepage and a dashboard that shows a moving car, telemetry charts, g-force, lap timing, and an SVG raceline for Raceland Krsko.

## What Is Done
- Project scaffolded as a React + Vite app.
- Homepage added with a start flow.
- Dashboard added with live simulated telemetry.
- Stat cards, pedal charts, g-force gauge, and lap table are implemented.
- The app now uses a single fixed race track for the current session.
- Track data now uses `outline_cropped.svg` as the raceline source, and the map/preview are generated from that SVG path.
- Current map center for Raceland Krsko is:
  - `[15.53519602474387, 45.9308122843152]`

## Current State
- The dashboard is working in the current workspace.
- The SVG raceline is now the track display source.
- The track panel is rendered without MapLibre tiles or background map data.
- The telemetry is being driven from the track shape so the session feels more coherent.

## Next Step
- Tune the SVG track rendering and simulation coefficients if the pacing or g-force feel needs adjustment.
- Best options:
  - manually trace the track into GeoJSON or SVG path data
  - use a GIS tool like `JOSM`, `QGIS`, or `geojson.io`
  - use a screenshot as a tracing reference if exact GPS data is not available

## Notes For Later
- Keep the telemetry simulation coherent:
  - speed should follow track segment type
  - throttle and brake should stay tied to speed changes
  - g-force should follow cornering and braking
  - lap time should stay consistent with track length
- Keep the app simple and local:
  - no backend yet
  - no database yet
  - track data can stay in local files for now

## Assumptions
- Raceland Krsko is the only track that matters for the current map.
- Track coordinates will be stored in `[longitude, latitude]` order.
- The track outline can be represented as GeoJSON or SVG depending on the final tracing approach.
