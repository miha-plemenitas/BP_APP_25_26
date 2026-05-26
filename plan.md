# Raceland Telemetry Plan

## Summary
Build a React + Vite web app for simulated racing telemetry. The app has a homepage and a dashboard that shows a moving car, telemetry charts, g-force, and lap timing. The current map implementation uses MapLibre with Raceland Krsko as the track location.

## What Is Done
- Project scaffolded as a React + Vite app.
- Homepage added with a start flow.
- Dashboard added with live simulated telemetry.
- Stat cards, pedal charts, g-force gauge, and lap table are implemented.
- The app now uses a single fixed race track for the current session.
- MapLibre is restored for the map view.
- Current map center for Raceland Krsko is:
  - `[15.53519602474387, 45.9308122843152]`
  - MapLibre uses `[longitude, latitude]` order.

## Current State
- The dashboard is working and the build passes.
- The map still needs the Raceland Krsko track traced more accurately.
- We currently have a route approximation on the map, not a perfect traced circuit.

## Next Step
- Trace the Raceland Krsko racetrack properly and replace the approximate route with the traced track.
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
