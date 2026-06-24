// swift-tools-version: 5.9
import PackageDescription

let package = Package(
    name: "ClaudeApp",
    platforms: [
        .iOS(.v16)
    ],
    targets: [
        .target(
            name: "ClaudeApp",
            path: "ClaudeApp"
        ),
        .testTarget(
            name: "ClaudeAppTests",
            dependencies: ["ClaudeApp"],
            path: "ClaudeAppTests"
        )
    ]
)
