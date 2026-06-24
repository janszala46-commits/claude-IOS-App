import SwiftUI

struct ContentView: View {
    @StateObject private var viewModel = ContentViewModel()

    var body: some View {
        NavigationStack {
            List(viewModel.items) { item in
                NavigationLink(destination: DetailView(item: item)) {
                    ItemRowView(item: item)
                }
            }
            .navigationTitle("ClaudeApp")
            .toolbar {
                ToolbarItem(placement: .navigationBarTrailing) {
                    Button {
                        viewModel.addItem()
                    } label: {
                        Image(systemName: "plus")
                    }
                }
            }
            .overlay {
                if viewModel.items.isEmpty {
                    ContentUnavailableView(
                        "Keine Einträge",
                        systemImage: "tray",
                        description: Text("Tippe auf + um einen Eintrag hinzuzufügen.")
                    )
                }
            }
        }
    }
}

#Preview {
    ContentView()
}
