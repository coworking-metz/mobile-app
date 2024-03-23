# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [unreleased]

### Changed

- Disable slide to unlock deck door when missing capability.
- Disable instead of hide front gate card when missing capability.
- Disable instead of hide parking access card when missing capability.

### Fixed

- Ability to refresh home screen even when not a member.

## [1.3.0] - 2024-03-05

### Added

- Show whether the user is currently attending with a green badge.
- Add consumed tickets count to tickets sheet.
- `BETA` tag to parking barrier card.

### Changed

- Add a linear gradient and change the period selection button on presence graph.
- Hide period selection if user presence is less than 6 months old.

### Fixed

- Typo in `Déverrouiller` in French.
- Half days color on presence graph when user hasn't attended a full day not even once.

## [1.2.0] - 2024-02-23

### Added

- Manage on-premise appliances:
  - Swipe to unlock open space door to get inside,
  - View the occupancy rate and current status of telephone booths.
- Swipe between your current, past and future subscriptions.
- Week days indication on presence graph.
- Prompt a contact sheet when having a problem.

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

[unreleased]: https://github.com/coworking-metz/mobile-app/compare/1.3.0...main
[1.3.0]: https://github.com/coworking-metz/mobile-app/compare/1.2.0...1.3.0
[1.2.0]: https://github.com/coworking-metz/mobile-app/compare/1.1.0...1.2.0
[1.1.0]: https://github.com/coworking-metz/mobile-app/compare/1.0.0...1.1.0
