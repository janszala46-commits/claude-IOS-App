import XCTest
@testable import ClaudeApp

final class ContentViewModelTests: XCTestCase {
    private var sut: ContentViewModel!
    private var mockService: MockItemService!

    override func setUp() {
        super.setUp()
        mockService = MockItemService()
        sut = ContentViewModel(itemService: mockService)
    }

    override func tearDown() {
        sut = nil
        mockService = nil
        super.tearDown()
    }

    func testInitialItemsAreLoaded() {
        mockService.stubbedItems = Item.samples
        sut = ContentViewModel(itemService: mockService)
        XCTAssertEqual(sut.items.count, Item.samples.count)
    }

    func testAddItemIncreasesCount() {
        let initialCount = sut.items.count
        sut.addItem()
        XCTAssertEqual(sut.items.count, initialCount + 1)
    }

    func testAddItemSavesToService() {
        sut.addItem()
        XCTAssertTrue(mockService.saveCalled)
    }

    func testDeleteItemDecreasesCount() {
        sut.addItem()
        sut.addItem()
        sut.delete(at: IndexSet(integer: 0))
        XCTAssertEqual(sut.items.count, 1)
    }
}

// MARK: - Mock

final class MockItemService: ItemServiceProtocol {
    var stubbedItems: [Item] = []
    var saveCalled = false

    func load() -> [Item] { stubbedItems }

    func save(_ items: [Item]) {
        saveCalled = true
        stubbedItems = items
    }
}
