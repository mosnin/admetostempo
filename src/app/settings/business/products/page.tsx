'use client'

import * as React from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useRouter } from 'next/navigation'
import { Package, Plus, Edit2, Trash2, Link2, ToggleLeft, ToggleRight, Loader2, X, Check } from 'lucide-react'
import { Product } from '@/components/business/ProductCard'
import { Input, Textarea } from '@/components/ui/Input'
import { Button } from '@/components/ui/Button'
import { Modal } from '@/components/ui/Modal'
import { Skeleton } from '@/components/ui/Skeleton'

interface ProductFormState {
  name: string
  description: string
  price: string
  image_url: string
  available: boolean
}

const EMPTY_FORM: ProductFormState = {
  name: '',
  description: '',
  price: '',
  image_url: '',
  available: true,
}

function ProductRow({
  product,
  businessUsername,
  onEdit,
  onDelete,
  onToggle,
}: {
  product: Product
  businessUsername: string
  onEdit: (p: Product) => void
  onDelete: (p: Product) => void
  onToggle: (p: Product) => void
}) {
  const [copied, setCopied] = React.useState(false)

  const payLink =
    typeof window !== 'undefined'
      ? `${window.location.origin}/send?to=${businessUsername}&amount=${product.price}&memo=${encodeURIComponent(product.name)}`
      : `/send?to=${businessUsername}&amount=${product.price}&memo=${encodeURIComponent(product.name)}`

  function handleCopy() {
    navigator.clipboard.writeText(payLink).then(() => {
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    })
  }

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, x: -20 }}
      transition={{ type: 'spring', stiffness: 300, damping: 26 }}
      className={[
        'rounded-2xl border p-4 bg-white/60',
        product.available
          ? 'border-[rgba(196,181,253,0.25)]'
          : 'border-[#e8e4fd] opacity-70',
      ].join(' ')}
    >
      <div className="flex items-start justify-between gap-3">
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-0.5">
            <span className="font-semibold text-[#1e1b4b] text-sm truncate">{product.name}</span>
            {!product.available && (
              <span className="px-1.5 py-0.5 rounded-full text-[10px] font-semibold bg-[#f3f4f6] text-[#9ca3af]">
                Hidden
              </span>
            )}
          </div>
          <p className="text-lg font-bold text-[#7c3aed]">
            ${typeof product.price === 'number' ? product.price.toFixed(2) : product.price}
            <span className="text-xs font-normal text-[#9ca3af] ml-1">pathUSD</span>
          </p>
          {product.description && (
            <p className="text-xs text-[#6b7280] line-clamp-1 mt-0.5">{product.description}</p>
          )}
        </div>

        <div className="flex items-center gap-2 shrink-0">
          <button
            type="button"
            onClick={() => onToggle(product)}
            className="text-[#a78bfa] hover:text-[#7c3aed] transition-colors"
            title={product.available ? 'Hide product' : 'Show product'}
          >
            {product.available ? <ToggleRight size={20} /> : <ToggleLeft size={20} />}
          </button>
          <button
            type="button"
            onClick={() => onEdit(product)}
            className="text-[#a78bfa] hover:text-[#7c3aed] transition-colors"
          >
            <Edit2 size={16} />
          </button>
          <button
            type="button"
            onClick={() => onDelete(product)}
            className="text-[#fb7185] hover:text-[#f43f5e] transition-colors"
          >
            <Trash2 size={16} />
          </button>
        </div>
      </div>

      {/* Pay link */}
      <div className="mt-3 flex items-center gap-2">
        <div className="flex-1 px-3 py-1.5 rounded-xl bg-[#f5f3ff] border border-[#e8e4fd] text-xs font-mono text-[#6b7280] truncate">
          {payLink}
        </div>
        <button
          type="button"
          onClick={handleCopy}
          className="shrink-0 flex items-center gap-1 px-2.5 py-1.5 rounded-xl bg-[#ede9fe] text-[#7c3aed] text-xs font-semibold hover:bg-[#ddd6fe] transition-colors"
        >
          {copied ? <Check size={12} /> : <Link2 size={12} />}
          {copied ? 'Copied' : 'Copy'}
        </button>
      </div>
    </motion.div>
  )
}

function ProductFormModal({
  open,
  onClose,
  initial,
  onSave,
}: {
  open: boolean
  onClose: () => void
  initial?: Product | null
  onSave: (data: ProductFormState) => Promise<void>
}) {
  const [form, setForm] = React.useState<ProductFormState>(
    initial
      ? {
          name: initial.name,
          description: initial.description,
          price: String(initial.price),
          image_url: initial.image_url ?? '',
          available: initial.available ?? true,
        }
      : EMPTY_FORM
  )
  const [saving, setSaving] = React.useState(false)
  const [error, setError] = React.useState('')

  React.useEffect(() => {
    if (open) {
      setForm(
        initial
          ? {
              name: initial.name,
              description: initial.description,
              price: String(initial.price),
              image_url: initial.image_url ?? '',
              available: initial.available ?? true,
            }
          : EMPTY_FORM
      )
      setError('')
    }
  }, [open, initial])

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!form.name || !form.price) {
      setError('Name and price are required.')
      return
    }
    if (isNaN(parseFloat(form.price)) || parseFloat(form.price) < 0) {
      setError('Please enter a valid price.')
      return
    }
    setSaving(true)
    setError('')
    try {
      await onSave(form)
      onClose()
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Failed to save product')
    } finally {
      setSaving(false)
    }
  }

  return (
    <Modal
      open={open}
      onOpenChange={(o) => !o && onClose()}
      title={initial ? 'Edit Product' : 'Add Product'}
      description={initial ? 'Update the product details below.' : 'Add a new product or service.'}
    >
      <form onSubmit={handleSubmit} className="space-y-4 mt-2">
        <Input
          label="Product Name *"
          placeholder="Iced Latte"
          value={form.name}
          onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
          required
        />
        <Input
          label="Price (pathUSD) *"
          placeholder="5.00"
          type="number"
          min="0"
          step="0.01"
          value={form.price}
          onChange={(e) => setForm((f) => ({ ...f, price: e.target.value }))}
          required
        />
        <Textarea
          label="Description"
          placeholder="Short description of the product..."
          value={form.description}
          onChange={(e) => setForm((f) => ({ ...f, description: e.target.value }))}
          rows={2}
          maxLength={200}
        />
        <Input
          label="Image URL"
          placeholder="https://..."
          type="url"
          value={form.image_url}
          onChange={(e) => setForm((f) => ({ ...f, image_url: e.target.value }))}
        />
        <div className="flex items-center justify-between">
          <span className="text-sm font-medium text-[#1e1b4b]">Available for purchase</span>
          <button
            type="button"
            onClick={() => setForm((f) => ({ ...f, available: !f.available }))}
            className={[
              'w-11 h-6 rounded-full relative transition-colors',
              form.available ? 'bg-[#a7f3d0]' : 'bg-[#e8e4fd]',
            ].join(' ')}
          >
            <span
              className={[
                'absolute top-1 w-4 h-4 rounded-full bg-white shadow transition-transform',
                form.available ? 'translate-x-6' : 'translate-x-1',
              ].join(' ')}
            />
          </button>
        </div>
        {error && <p className="text-xs text-[#f43f5e] font-medium">{error}</p>}
        <Button type="submit" variant="primary" size="lg" loading={saving} className="w-full">
          {initial ? 'Save Changes' : 'Add Product'}
        </Button>
      </form>
    </Modal>
  )
}

export default function ManageProductsPage() {
  const router = useRouter()
  const [products, setProducts] = React.useState<Product[]>([])
  const [loading, setLoading] = React.useState(true)
  const [businessUsername, setBusinessUsername] = React.useState('')
  const [modalOpen, setModalOpen] = React.useState(false)
  const [editTarget, setEditTarget] = React.useState<Product | null>(null)
  const [deleteTarget, setDeleteTarget] = React.useState<Product | null>(null)

  React.useEffect(() => {
    fetch('/api/business/mine')
      .then((r) => (r.ok ? r.json() : null))
      .then((data) => {
        if (!data) {
          router.push('/settings/business')
          return
        }
        setBusinessUsername(data.business?.username ?? '')
        return fetch(`/api/business/${data.business?.username}/products`)
      })
      .then((r) => (r && r.ok ? r.json() : { products: [] }))
      .then((data) => setProducts(data.products ?? []))
      .catch(() => {})
      .finally(() => setLoading(false))
  }, [router])

  async function handleSave(form: ProductFormState) {
    const payload = { ...form, price: parseFloat(form.price) }
    if (editTarget?.id) {
      const res = await fetch(`/api/business/${businessUsername}/products/${editTarget.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      })
      if (!res.ok) throw new Error('Failed to update product')
      const data = await res.json()
      setProducts((prev) =>
        prev.map((p) => (p.id === editTarget.id ? { ...data.product, id: editTarget.id } : p))
      )
    } else {
      const res = await fetch(`/api/business/${businessUsername}/products`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      })
      if (!res.ok) throw new Error('Failed to add product')
      const data = await res.json()
      setProducts((prev) => [...prev, data.product])
    }
    setEditTarget(null)
  }

  async function handleDelete(product: Product) {
    if (!product.id) return
    await fetch(`/api/business/${businessUsername}/products/${product.id}`, { method: 'DELETE' })
    setProducts((prev) => prev.filter((p) => p.id !== product.id))
    setDeleteTarget(null)
  }

  async function handleToggle(product: Product) {
    if (!product.id) return
    const res = await fetch(`/api/business/${businessUsername}/products/${product.id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ available: !product.available }),
    })
    if (res.ok) {
      setProducts((prev) =>
        prev.map((p) => (p.id === product.id ? { ...p, available: !p.available } : p))
      )
    }
  }

  function openAdd() {
    setEditTarget(null)
    setModalOpen(true)
  }

  function openEdit(product: Product) {
    setEditTarget(product)
    setModalOpen(true)
  }

  if (loading) {
    return (
      <div className="space-y-4">
        <Skeleton variant="text" width="40%" />
        <Skeleton variant="rect" height={44} className="rounded-2xl" />
        {Array.from({ length: 3 }).map((_, i) => (
          <Skeleton key={i} variant="card" height={110} className="rounded-2xl" />
        ))}
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-[#1e1b4b]">Manage Products</h1>
          <p className="text-sm text-[#6b7280]">Add and manage what customers can pay for.</p>
        </div>
        <Button variant="primary" size="md" leftIcon={<Plus size={16} />} onClick={openAdd}>
          Add
        </Button>
      </div>

      {products.length === 0 ? (
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center py-16 rounded-2xl border border-dashed border-[#c4b5fd]/50"
        >
          <Package size={40} className="text-[#c4b5fd] mx-auto mb-3" />
          <p className="text-[#6b7280] font-medium mb-1">No products yet</p>
          <p className="text-xs text-[#9ca3af] mb-4">
            Add your first product to start accepting payments.
          </p>
          <Button variant="primary" size="md" leftIcon={<Plus size={16} />} onClick={openAdd}>
            Add Product
          </Button>
        </motion.div>
      ) : (
        <AnimatePresence>
          <div className="space-y-3">
            {products.map((product) => (
              <ProductRow
                key={product.id ?? product.name}
                product={product}
                businessUsername={businessUsername}
                onEdit={openEdit}
                onDelete={setDeleteTarget}
                onToggle={handleToggle}
              />
            ))}
          </div>
        </AnimatePresence>
      )}

      {/* Add/Edit modal */}
      <ProductFormModal
        open={modalOpen}
        onClose={() => { setModalOpen(false); setEditTarget(null) }}
        initial={editTarget}
        onSave={handleSave}
      />

      {/* Delete confirm modal */}
      <Modal
        open={!!deleteTarget}
        onOpenChange={(o) => !o && setDeleteTarget(null)}
        title="Delete Product"
        description={`Are you sure you want to delete "${deleteTarget?.name}"? This cannot be undone.`}
      >
        <div className="flex gap-3 mt-4">
          <Button
            variant="ghost"
            size="md"
            className="flex-1"
            onClick={() => setDeleteTarget(null)}
          >
            Cancel
          </Button>
          <Button
            variant="destructive"
            size="md"
            className="flex-1"
            onClick={() => deleteTarget && handleDelete(deleteTarget)}
          >
            Delete
          </Button>
        </div>
      </Modal>
    </div>
  )
}
