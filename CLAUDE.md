# CLAUDE.md — iOS Projektkonventionen

## Projektübersicht

Dieses Repository enthält eine iOS-App, entwickelt mit Swift und Xcode.

## Voraussetzungen (lokale macOS-Entwicklung)

| Tool | Installation | Zweck |
|------|-------------|-------|
| Xcode | Mac App Store | IDE, Simulator, Build-Tools |
| CocoaPods | `sudo gem install cocoapods` | Dependency Management |
| SwiftLint | `brew install swiftlint` | Code-Qualität & Style Enforcement |
| xcbeautify | `brew install xcbeautify` | Lesbarer xcodebuild-Output |
| Homebrew | https://brew.sh | Paketmanager für macOS |

## Build-Befehle

```bash
# Projekt bauen (Debug)
xcodebuild -scheme <SchemeName> -destination 'platform=iOS Simulator,name=iPhone 15' build

# Lesbarer Build-Output
xcodebuild -scheme <SchemeName> -destination 'platform=iOS Simulator,name=iPhone 15' build | xcbeautify

# Tests ausführen
xcodebuild -scheme <SchemeName> -destination 'platform=iOS Simulator,name=iPhone 15' test | xcbeautify

# SwiftLint ausführen
swiftlint lint --config .swiftlint.yml

# CocoaPods installieren
pod install

# Simulator starten
xcrun simctl boot "iPhone 15"
open -a Simulator
```

## Projektstruktur

```
.
├── <AppName>/
│   ├── AppDelegate.swift
│   ├── SceneDelegate.swift
│   ├── Views/
│   ├── ViewModels/
│   ├── Models/
│   ├── Services/
│   └── Resources/
├── <AppName>Tests/
├── <AppName>UITests/
├── Podfile
├── .swiftlint.yml
├── CLAUDE.md
└── .gitignore
```

## Code-Konventionen

### Swift Style
- **Architektur**: MVVM (Model-View-ViewModel)
- **Swift Version**: 5.9+
- **iOS Deployment Target**: iOS 16.0+
- **Naming**: camelCase für Variablen/Funktionen, PascalCase für Typen
- **Keine Force Unwrap** (`!`) in Produktionscode — stattdessen `guard let` / `if let`
- **Keine impliziten optionalen** außer `@IBOutlet`

### SwiftUI vs UIKit
- Neue Features in **SwiftUI** implementieren
- Legacy-Code in UIKit wird schrittweise migriert

### Async/Await
- `async/await` statt Completion Handlers für neue asynchrone Funktionen
- `@MainActor` für UI-Updates

## Testing

- Unit Tests im Ordner `<AppName>Tests/`
- UI Tests im Ordner `<AppName>UITests/`
- Mindest-Testabdeckung: 70%
- Mocks via Protokolle (kein externes Mock-Framework nötig)

## Git-Workflow

- Branch-Schema: `feature/`, `fix/`, `chore/`
- Commits auf Englisch, im Imperativ: `Add login screen`, `Fix crash on launch`
- Kein direkter Push auf `main`
- PRs erfordern mindestens einen Review

## CI/CD

- Xcode Cloud oder GitHub Actions für automatische Builds & Tests
- Archivierung und App Store Connect Upload via fastlane (optional)

## Simulator-Verwaltung

```bash
# Verfügbare Simulatoren auflisten
xcrun simctl list devices available

# App auf Simulator installieren
xcrun simctl install booted <path-to.app>

# App starten
xcrun simctl launch booted <bundle-identifier>

# Logs streamen
xcrun simctl spawn booted log stream --predicate 'subsystem == "<bundle-identifier>"'
```

## Secrets & Konfiguration

- Keine API-Keys im Code — stattdessen `Info.plist`-Variablen oder Umgebungsvariablen via Xcode Scheme
- `.env`-Dateien sind in `.gitignore` ausgeschlossen
- Signing-Zertifikate **niemals** committen

## Häufige Xcode-Probleme

```bash
# DerivedData bereinigen
rm -rf ~/Library/Developer/Xcode/DerivedData

# SPM-Cache leeren
rm -rf ~/Library/Caches/org.swift.swiftpm

# CocoaPods-Cache leeren
pod cache clean --all && pod install
```
