"use client"

import type React from "react"

import { useState } from "react"
import { X } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog"

type Role = "coach" | "athlete" | null

interface AuthModalProps {
  isOpen: boolean
  onClose: () => void
}

export function AuthModal({ isOpen, onClose }: AuthModalProps) {
  const [selectedRole, setSelectedRole] = useState<Role>(null)
  const [formData, setFormData] = useState({
    name: "",
    email: "",
  })

  const handleRoleSelect = (role: Role) => {
    setSelectedRole(role)
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }))
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    // Here you would handle the form submission with the role and form data
    console.log("Submitting:", { role: selectedRole, ...formData })
    // You can add your API call or authentication logic here

    // Close the modal after submission or show success message
    // onClose();
  }

  const resetModal = () => {
    setSelectedRole(null)
    setFormData({ name: "", email: "" })
    onClose()
  }

  return (
    <Dialog open={isOpen} onOpenChange={resetModal}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <div className="flex items-center justify-between">
            <DialogTitle>{selectedRole ? `Sign up as ${selectedRole}` : "Choose your role"}</DialogTitle>
          </div>
          <DialogDescription>
            {selectedRole
              ? "Please fill in your details to create an account"
              : "Select how you want to use NotionCoach"}
          </DialogDescription>
        </DialogHeader>

        {!selectedRole ? (
          <div className="flex flex-col gap-4 py-4">
            <Button size="lg" className="w-full text-lg" onClick={() => handleRoleSelect("coach")}>
              Continue as Coach
            </Button>
            <Button size="lg" className="w-full text-lg" onClick={() => handleRoleSelect("athlete")}>
              Continue as Athlete
            </Button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="name">Name</Label>
              <Input
                id="name"
                name="name"
                placeholder="Enter your name"
                value={formData.name}
                onChange={handleInputChange}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                name="email"
                type="email"
                placeholder="you@example.com"
                value={formData.email}
                onChange={handleInputChange}
                required
              />
            </div>
            <Button type="submit" className="w-full">
              Register as {selectedRole}
            </Button>
          </form>
        )}
      </DialogContent>
    </Dialog>
  )
}
