import SwiftUI

struct DetailView: View {
    let item: Item

    var body: some View {
        VStack(alignment: .leading, spacing: 16) {
            Text(item.title)
                .font(.title)
                .fontWeight(.bold)

            Text(item.description)
                .font(.body)
                .foregroundStyle(.secondary)

            Text("Erstellt: \(item.createdAt.formatted(date: .long, time: .shortened))")
                .font(.caption)
                .foregroundStyle(.tertiary)

            Spacer()
        }
        .padding()
        .navigationTitle("Detail")
        .navigationBarTitleDisplayMode(.inline)
    }
}

#Preview {
    NavigationStack {
        DetailView(item: Item.preview)
    }
}
