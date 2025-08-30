export default function AdminLayout({ children }: { children: React.ReactNode }) {
    return (
      <div className="flex">
        <aside className="w-64 bg-gray-900 text-white">Sidebar Admin</aside>
        <main className="flex-1 p-4">{children}</main>
      </div>
    );
  }
  