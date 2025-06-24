# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [unreleased]

## [2025.6.2] - 2025-06-24

### Fixed

- Fade text on situation cards when too large.
- Reload images every day.

## [2025.6.1] - 2025-06-04

### Added

- Fader on home screen bottom to avoid pressing buttons when swiping back to system home.
- Auto-refresh home screen data when stale and connected to high speed connection.

## [2025.5.1] - 2025-05-03

### Added

- Describe anonymous member profile.

## [2025.4.3] - 2025-04-30

### Added

- Render initials as profile picture for members that don't have any.

### Fixed

- Touch uncentered elements on home screen for wide devices.

## [2025.4.2] - 2025-04-23

### Added

- Widescreen layout.
- Newsletter link on socials bottom sheet.

### Changed

- Count attempts when automatically pairing a device.

### Fixed

- Properly reset animation on Home screen once refresh is done.

## [2025.4.1] - 2025-04-15

### Added

- Surprise 🤫
- Devices management.
- Flex desks on `P'ti Poulailler` floor plan.
- Releases notes on `about` screen.
- Social networks bottom sheet on `settings` screen.

### Changed

- Improve scroll handling on home screen.
- Apply a new font everywhere.

### Fixed

- (iOS only) Prefer logout through a webview instead of default browser.

## [2025.3.2] - 2025-03-14

### Added

- Ability to manually close toast notification.

### Changed

- Load picture faster when viewing in fullscreen.

## [2025.3.1] - 2025-03-10

### Added

- Zoom on account profile picture.
- Warn when attending with insufficient balance.
- Climate sensors on floor plans.
- Add event to user calendar.
- New privacy screen to review app permissions.
- Explicit button to refresh home screen data.

### Changed

- Retrieve floor plans state even as guest.

## [2025.2.4] - 2025-02-10

### Fixed

- Properly render events filter options on the list.
- Keep back button visible by shorting long title on most screens.

## [2025.2.3] - 2025-02-04

### Changed

- (iOS only) Prefer login through a webview instead of default browser.
See https://developer.apple.com/app-store/review/guidelines/#design

## [2025.2.2] - 2025-02-02

### Added

- Quick action to contact.

### Fixed

- Crash during onboarding.

## [2025.2.1] - 2025-02-02

### Added

- Render multiple pictures in event detail screen.
- Change events calendar layout.

## [2025.1.2] - 2025-01-13

### Fixed

- Presence square colors depending on the activity.

## [2025.1.1] - 2025-01-11

### Added

- Account page to view personal data.
- Loading spinner on home profile picture when fetching data.
- Animation when changing theme.
- Colorize mobile phone animation in first onboarding step.

## [2024.12.3] - 2024-12-24

### Added

- Render activity, attendance and savings for each subscription.
- Bottom sheet to rate the app.

## [2024.12.2] - 2024-12-20

### Changed

- Allow manual change of access and refresh tokens.

### Fixed

- Button touches are properly handled inside bottom sheets.

## [2024.12.1] - 2024-12-19

### Added

- Advanced settings screen for power users.

### Changed

- Increase bottom sheets width.
- Keep services enabled in guest mode.
- Add gradient background color to rounded buttons.

### Fixed

- Logout should not require additional user interactions.
- Contact through direct message identify user.

## [2024.9.2] - 2024-09-27

### Fixed

- Render on premise state on both floor plans.

## [2024.9.1] - 2024-09-26

### Added

- New `P'ti Poulailler` floor plan.
- Render `hello` on presence graph when unauthenticated.
- Color carbon dioxide level around its icon on workspace plan.
- Touch stale data text to refresh on home screen.
- Badge on ongoing event card.
- Events count on home screen.

### Changed

- Increase intercom and parking buttons size.
- Remove `beta` tag from parking button.
- Touch title on unauthenticated empty state to login.
- Prefer render a member face instead of `+1` on occupancy count.
- Prefer external browser to login and logout.

### Fixed

- Onboarding does not freeze home screen on first launch.

## [2024.5.2] - 2024-05-27

### Fixed

- Do not crash when user pulls to refresh on home screen.

## [2024.5.1] - 2024-05-26

### Added

- Guest mode: unauthenticated user are now able to navigate inside the app with restrictions.
They will be reminded that an account is needed to unlock all features.

### Changed

- Remove login wall.
- Improve initial launch performances.

## [1.6.3] - 2024-04-26

### Fixed

- Limit user email to a single line on settings screen.

## [1.6.2] - 2024-04-24

### Fixed

- Properly select current subscription when opening bottom sheet.
- Carbon dioxide segmented level on the segmented arc.

## [1.6.1] - 2024-04-23

### Changed

- Increase font size on carbon dioxide level description.
- Animation color on phone booths bottom sheet.
- Prefer onboarding label `présentation` over `introduction` in French.

### Fixed

- (Android only) Ease home screen pull to refresh.
- (Android only) Remove white flash when navigating.
- Persist the chosen theme option.

## [1.6.0] - 2024-04-21

### Added

- Refresh animations on home page.

## [1.5.1] - 2024-04-14

### Added

- User roles on settings screen.

### Changed

- Use `voting member` term instead of `active member` for member status.

### Fixed

- Properly computed non compliant dates and overconsumption.

## [1.5.0] - 2024-04-09

### Added

- Get the key box code on the workspace plan.
- Render the carbon dioxide level on the workspace plan.
- Swipe down to refresh on the workspace plan.
- Swipe down to dismiss fullscreen image view.

### Changed

- Render total activity count and first activity date instead of year when scrolling presence graph.

### Fixed

- Reverse theme french translations.

## [1.4.1] - 2024-04-04

### Fixed

- Calendar event date format when happening next week.
- Properly report errors.

## [1.4.0] - 2024-04-02

### Added

- Appointment card on home screen.

### Changed

- Disable slide to unlock deck door when missing capability.
- Disable instead of hide front gate card when missing capability.
- Disable instead of hide parking access card when missing capability.

### Fixed

- Ability to refresh home screen even when not a member.
- Keep parking barrier card icon visible on theme change.

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

[unreleased]: https://github.com/coworking-metz/mobile-app/compare/2025.6.2...main
[2025.6.2]: https://github.com/coworking-metz/mobile-app/compare/2025.6.1...2025.6.2
[2025.6.1]: https://github.com/coworking-metz/mobile-app/compare/2025.5.1...2025.6.1
[2025.5.1]: https://github.com/coworking-metz/mobile-app/compare/2025.4.3...2025.5.1
[2025.4.3]: https://github.com/coworking-metz/mobile-app/compare/2025.4.2...2025.4.3
[2025.4.2]: https://github.com/coworking-metz/mobile-app/compare/2025.4.1...2025.4.2
[2025.4.1]: https://github.com/coworking-metz/mobile-app/compare/2025.3.2...2025.4.1
[2025.3.2]: https://github.com/coworking-metz/mobile-app/compare/2025.3.1...2025.3.2
[2025.3.1]: https://github.com/coworking-metz/mobile-app/compare/2025.2.4...2025.3.1
[2025.2.4]: https://github.com/coworking-metz/mobile-app/compare/2025.2.3...2025.2.4
[2025.2.3]: https://github.com/coworking-metz/mobile-app/compare/2025.2.2...2025.2.3
[2025.2.2]: https://github.com/coworking-metz/mobile-app/compare/2025.2.1...2025.2.2
[2025.2.1]: https://github.com/coworking-metz/mobile-app/compare/2025.1.2...2025.2.1
[2025.1.2]: https://github.com/coworking-metz/mobile-app/compare/2025.1.1...2025.1.2
[2025.1.1]: https://github.com/coworking-metz/mobile-app/compare/2024.12.3...2025.1.1
[2024.12.3]: https://github.com/coworking-metz/mobile-app/compare/2024.12.2...2024.12.3
[2024.12.2]: https://github.com/coworking-metz/mobile-app/compare/2024.12.1...2024.12.2
[2024.12.1]: https://github.com/coworking-metz/mobile-app/compare/2024.9.2...2024.12.1
[2024.9.2]: https://github.com/coworking-metz/mobile-app/compare/2024.9.1...2024.9.2
[2024.9.1]: https://github.com/coworking-metz/mobile-app/compare/2024.5.2...2024.9.1
[2024.5.2]: https://github.com/coworking-metz/mobile-app/compare/2024.5.1...2024.5.2
[2024.5.1]: https://github.com/coworking-metz/mobile-app/compare/1.6.3...2024.5.1
[1.6.3]: https://github.com/coworking-metz/mobile-app/compare/1.6.2...1.6.3
[1.6.2]: https://github.com/coworking-metz/mobile-app/compare/1.6.1...1.6.2
[1.6.1]: https://github.com/coworking-metz/mobile-app/compare/1.6.0...1.6.1
[1.6.0]: https://github.com/coworking-metz/mobile-app/compare/1.5.1...1.6.0
[1.5.1]: https://github.com/coworking-metz/mobile-app/compare/1.5.0...1.5.1
[1.5.0]: https://github.com/coworking-metz/mobile-app/compare/1.4.1...1.5.0
[1.4.1]: https://github.com/coworking-metz/mobile-app/compare/1.4.0...1.4.1
[1.4.0]: https://github.com/coworking-metz/mobile-app/compare/1.3.0...1.4.0
[1.3.0]: https://github.com/coworking-metz/mobile-app/compare/1.2.0...1.3.0
[1.2.0]: https://github.com/coworking-metz/mobile-app/compare/1.1.0...1.2.0
[1.1.0]: https://github.com/coworking-metz/mobile-app/compare/1.0.0...1.1.0
