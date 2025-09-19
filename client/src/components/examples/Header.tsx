import Header from '../Header'

export default function HeaderExample() {
  return (
    <div className="space-y-8">
      <div>
        <h3 className="text-lg font-medium mb-4">Logged Out State</h3>
        <Header isAuthenticated={false} />
      </div>
      <div>
        <h3 className="text-lg font-medium mb-4">Logged In User</h3>
        <Header isAuthenticated={true} isAdmin={false} />
      </div>
      <div>
        <h3 className="text-lg font-medium mb-4">Admin User</h3>
        <Header isAuthenticated={true} isAdmin={true} />
      </div>
    </div>
  )
}