import { useState, useEffect } from "react"
import { Link, useLocation, useNavigate } from "react-router-dom"
import { Users, Package, Layers } from "lucide-react"
import "../styles/Tab.css"

export function Tab() {
  const navigate = useNavigate()
  const location = useLocation()
  const [activeTab, setActiveTab] = useState("")
  const [userRole, setUserRole] = useState("usuario") 

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem("user"))
    if (user && user.rol) {
      setUserRole(user.rol)
    }
  }, [])

  const menuItems = [
    { id: "lotes", label: "Lotes", icon: Layers, path: "/Lotes" },
    { id: "auxiliares", label: "Auxiliares", icon: Package, path: "/Auxiliares" },
    { id: "usuarios", label: "Usuarios", icon: Users, path: "/Usuarios", adminOnly: true },
  ]

  const filteredMenuItems = menuItems.filter((item) => {
    if (item.adminOnly) {
      return userRole === "admin" 
    }
    return true 
  })

  useEffect(() => {
    const currentTab = filteredMenuItems.find((item) => item.path === location.pathname)
    if (currentTab) {
      setActiveTab(currentTab.id)
    }
  }, [location.pathname, filteredMenuItems])

  const handleTabClick = (item) => {
    setActiveTab(item.id)
    navigate(item.path)
  }

  return (
    <>
      <div className="bottom-menu-spacer"></div>

      <nav className="bottom-menu">
        {filteredMenuItems.map((item) => {
          const Icon = item.icon 
          return (
            <button
              key={item.id}
              className={`bottom-menu-item ${activeTab === item.id ? "active" : ""}`}
              onClick={() => handleTabClick(item)}
            >
              <Icon className="bottom-menu-icon" /> 
              <span className="bottom-menu-label">{item.label}</span>
            </button>
          )
        })}
      </nav>
    </>
  )
}