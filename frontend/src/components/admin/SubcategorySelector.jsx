import { Plus } from "lucide-react";

export default function SubcategorySelector({
  subcategory,
  setSubcategory,
  setSubcategoryDesc,
  availableSubcategories,
  isAddingSubcategory,
  setIsAddingSubcategory,
  newSubcategoryName,
  setNewSubcategoryName,
  newSubcategoryDesc,
  setNewSubcategoryDesc,
  onSaveCustomSubcategory,
}) {
  return (
    <div>
      <div className="flex items-center justify-between mb-1">
        <label className="block text-xs font-sans font-bold uppercase tracking-wider text-muted-foreground">
          Subcategory
        </label>
        <button
          type="button"
          onClick={() => setIsAddingSubcategory(!isAddingSubcategory)}
          className="text-[10px] font-sans uppercase font-bold text-amber-800 dark:text-amber-400 hover:underline flex items-center gap-1 cursor-pointer"
        >
          <Plus className="w-3 h-3" />
          <span>{isAddingSubcategory ? "Select" : "Add Custom"}</span>
        </button>
      </div>

      {isAddingSubcategory ? (
        <div className="space-y-1.5 p-2 bg-secondary/30 border border-amber-800/40 dark:border-amber-400/40 rounded-xs animate-in fade-in duration-150">
          <input
            type="text"
            value={newSubcategoryName}
            onChange={(e) => setNewSubcategoryName(e.target.value)}
            placeholder="Subcategory (e.g., Vector Models)..."
            className="w-full text-xs font-serif p-1.5 bg-background border border-border focus:border-foreground focus:outline-none"
            autoFocus
          />
          <input
            type="text"
            value={newSubcategoryDesc}
            onChange={(e) => setNewSubcategoryDesc(e.target.value)}
            placeholder="Short description (optional)..."
            className="w-full text-[11px] font-serif p-1.5 bg-background border border-border focus:border-foreground focus:outline-none"
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                e.preventDefault();
                onSaveCustomSubcategory();
              }
            }}
          />
          <div className="flex gap-1.5">
            <button
              type="button"
              onClick={onSaveCustomSubcategory}
              className="flex-1 px-2 py-1 bg-foreground text-background hover:bg-amber-800 hover:text-white text-[10px] font-sans uppercase font-bold tracking-wider rounded-xs cursor-pointer"
            >
              Save Subcategory
            </button>
            <button
              type="button"
              onClick={() => {
                setIsAddingSubcategory(false);
                setNewSubcategoryName("");
                setNewSubcategoryDesc("");
              }}
              className="px-2 py-1 border border-border hover:bg-secondary text-[10px] font-sans uppercase font-bold text-muted-foreground rounded-xs cursor-pointer"
            >
              Cancel
            </button>
          </div>
        </div>
      ) : (
        <select
          value={subcategory}
          onChange={(e) => {
            if (e.target.value === "__add_new_sub__") {
              setIsAddingSubcategory(true);
            } else {
              setSubcategory(e.target.value);
              const matched = availableSubcategories.find((s) => s.name === e.target.value);
              setSubcategoryDesc(matched?.desc || "");
            }
          }}
          className="w-full font-serif text-sm p-2.5 bg-secondary/20 border border-border focus:border-foreground focus:outline-none"
        >
          <option value="">-- General / No Subcategory --</option>
          {availableSubcategories.map((sub) => (
            <option key={sub.name} value={sub.name}>
              {sub.name}
            </option>
          ))}
          <option value="__add_new_sub__">+ Add Custom Subcategory...</option>
        </select>
      )}
    </div>
  );
}
