import SwiftUI

struct ItemRowView: View {
    let item: Item

    var body: some View {
        VStack(alignment: .leading, spacing: 4) {
            Text(item.title)
                .font(.headline)
            Text(item.description)
                .font(.subheadline)
                .foregroundStyle(.secondary)
                .lineLimit(2)
        }
        .padding(.vertical, 4)
    }
}

#Preview {
    ItemRowView(item: Item.preview)
}
