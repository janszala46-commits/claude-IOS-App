import Foundation

protocol ItemServiceProtocol {
    func load() -> [Item]
    func save(_ items: [Item])
}

final class ItemService: ItemServiceProtocol {
    private let key = "stored_items"
    private let decoder = JSONDecoder()
    private let encoder = JSONEncoder()

    func load() -> [Item] {
        guard let data = UserDefaults.standard.data(forKey: key),
              let items = try? decoder.decode([Item].self, from: data) else {
            return []
        }
        return items
    }

    func save(_ items: [Item]) {
        guard let data = try? encoder.encode(items) else { return }
        UserDefaults.standard.set(data, forKey: key)
    }
}
