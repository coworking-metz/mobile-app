# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## Unreleased

### Added

- Manage on-premise appliances:
  - Swipe to unlock open space door to get inside,
  - View the occupancy rate and current status of telephone booths.
- Swipe between your current, past and future subscriptions.
- Week days indication on presence graph.

### Changed

- Stale data text is absolute above 2 hours.
- Replace period selection by a button on presence graph.

## [1.1.0] - 2024-01-29

### Added

- (iOS only) Haptic feedback on Touchable elements.
- Render activity and status on the Membership bottom sheet.

### Changed

- Change controls label to be more explicit.

### Fixed

- Animations properly change color when switching between light and dark theme.
- Decrease success icon color on the tickets card in dark theme.
- Bottom sheet content should slide below the handle.

## 1.0.0 - 2024-01-26

### Added

Initial release with the following features:
- current occupancy,
- user profile (available tickets, current subscription and membership),
- events listing,
- services like opening the gate,
- user attendance history.

[unreleased]: https://github.com/coworking-metz/mobile-app/compare/1.1.0...main
[1.1.0]: https://github.com/coworking-metz/mobile-app/compare/1.0.0...1.1.0
