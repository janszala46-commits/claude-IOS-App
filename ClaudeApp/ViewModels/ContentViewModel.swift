import Foundation

@MainActor
final class ContentViewModel: ObservableObject {
    @Published private(set) var items: [Item] = []

    private let itemService: ItemServiceProtocol

    init(itemService: ItemServiceProtocol = ItemService()) {
        self.itemService = itemService
        loadItems()
    }

    func addItem() {
        let newItem = Item(
            title: "Neuer Eintrag \(items.count + 1)",
            description: "Automatisch erstellter Eintrag."
        )
        items.append(newItem)
        itemService.save(items)
    }

    func delete(at offsets: IndexSet) {
        items.remove(atOffsets: offsets)
        itemService.save(items)
    }

    private func loadItems() {
        items = itemService.load()
    }
}
