import { Layers, Tag, Plus, X } from 'lucide-react'
import Input from '@/components/common/Input'
import Dropdown from '@/components/common/Dropdown'

const CATEGORIES = [
  { value: 'electronics', label: 'Electronics' },
  { value: 'hardware', label: 'Hardware' },
]

const SUBCATEGORIES = [
  { value: 'laptops', label: 'Laptops' },
  { value: 'smartphones', label: 'Smartphones' },
  { value: 'audio', label: 'Audio' },
  { value: 'gaming', label: 'Gaming' },
  { value: 'wearables', label: 'Wearables' },
  { value: 'tablets', label: 'Tablets' },
  { value: 'cameras', label: 'Cameras' },
  { value: 'accessories', label: 'Accessories' },
]

export default function ProductOrganizationCard({
  category,
  subcategory,
  brand,
  tags = [],
  tagInput = '',
  onCategoryChange,
  onSubcategoryChange,
  onBrandChange,
  onTagInputChange,
  onAddTag,
  onKeyDownTag,
  onRemoveTag,
  errors = {},
}) {
  return (
    <div className="p-5 sm:p-6 rounded-2xl bg-white dark:bg-dark-bg-card border border-border-medium dark:border-primary-medium/30 shadow-xs space-y-4">
      <div className="flex items-center gap-2">
        <Layers className="w-4 h-4 text-primary-dark dark:text-text-gold" />
        <h3 className="text-xs font-bold uppercase tracking-wider font-heading text-primary-dark dark:text-text-light">
          Organization
        </h3>
      </div>

      {/* Category */}
      <div className="space-y-1.5">
        <label className="block text-xs font-bold text-primary-dark dark:text-text-light uppercase tracking-wider font-heading">
          Category
        </label>
        <Dropdown
          value={category}
          onChange={onCategoryChange}
          options={CATEGORIES}
          ariaLabel="Category"
        />
      </div>

      {/* Subcategory */}
      <div className="space-y-1.5">
        <label className="block text-xs font-bold text-primary-dark dark:text-text-light uppercase tracking-wider font-heading">
          Subcategory
        </label>
        <Dropdown
          value={subcategory}
          onChange={onSubcategoryChange}
          options={SUBCATEGORIES}
          ariaLabel="Subcategory"
        />
      </div>

      {/* Brand */}
      <Input
        label="Brand"
        placeholder="e.g. Apple, Sony, Dell, Lenovo"
        value={brand}
        onChange={(e) => onBrandChange(e.target.value)}
        error={errors.brand}
        required
      />

      {/* Tags Section */}
      <div className="space-y-2 pt-2 border-t border-border-medium dark:border-primary-medium/20">
        <div className="flex items-center gap-1.5">
          <Tag className="w-3.5 h-3.5 text-primary-medium dark:text-text-gold" />
          <label className="block text-xs font-bold text-primary-dark dark:text-text-light uppercase tracking-wider font-heading">
            Product Tags
          </label>
        </div>
        <div className="flex gap-2">
          <input
            type="text"
            placeholder="Add tag and press +"
            value={tagInput}
            onChange={(e) => onTagInputChange(e.target.value)}
            onKeyDown={onKeyDownTag}
            className="flex-1 px-3 py-2 bg-bg-main/50 dark:bg-dark-bg-main border border-border-medium hover:border-primary-medium rounded-xl text-xs text-text-primary dark:text-text-light placeholder-text-secondary/60 font-body focus:outline-none focus:ring-2 focus:ring-primary-medium dark:focus:ring-text-gold shadow-2xs"
          />
          <button
            type="button"
            onClick={onAddTag}
            className="px-3 py-2 bg-primary-medium hover:bg-primary-dark dark:bg-primary-medium dark:hover:bg-accent-gold-hover text-white rounded-xl text-xs font-bold flex items-center justify-center transition-colors cursor-pointer shadow-2xs"
            aria-label="Add tag"
          >
            <Plus className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* Tag Pills */}
        {tags.length > 0 && (
          <div className="flex flex-wrap gap-1.5 pt-1">
            {tags.map((tag) => (
              <span
                key={tag}
                className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-bg-main dark:bg-dark-bg-main border border-primary-medium/30 text-[11px] font-semibold text-primary-dark dark:text-text-light font-body shadow-2xs"
              >
                #{tag}
                <button
                  type="button"
                  onClick={() => onRemoveTag(tag)}
                  className="text-text-secondary hover:text-rose-500 transition-colors cursor-pointer"
                >
                  <X className="w-3 h-3" />
                </button>
              </span>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
