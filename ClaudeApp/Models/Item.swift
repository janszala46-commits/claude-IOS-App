import Foundation

struct Item: Identifiable, Codable {
    let id: UUID
    var title: String
    var description: String
    let createdAt: Date

    init(id: UUID = UUID(), title: String, description: String, createdAt: Date = .now) {
        self.id = id
        self.title = title
        self.description = description
        self.createdAt = createdAt
    }
}

extension Item {
    static let preview = Item(
        title: "Beispiel-Eintrag",
        description: "Das ist eine Beispiel-Beschreibung für die Vorschau."
    )

    static let samples: [Item] = [
        Item(title: "Erster Eintrag", description: "Beschreibung des ersten Eintrags"),
        Item(title: "Zweiter Eintrag", description: "Beschreibung des zweiten Eintrags"),
        Item(title: "Dritter Eintrag", description: "Beschreibung des dritten Eintrags")
    ]
}
