import { Plus } from "lucide-react";

export default function DepartmentSelector({
  category,
  setCategory,
  departmentsList,
  isAddingDepartment,
  setIsAddingDepartment,
  newDepartmentName,
  setNewDepartmentName,
  onSaveCustomDepartment,
}) {
  return (
    <div>
      <div className="flex items-center justify-between mb-1">
        <label className="block text-xs font-sans font-bold uppercase tracking-wider text-muted-foreground">
          Department
        </label>
        <button
          type="button"
          onClick={() => setIsAddingDepartment(!isAddingDepartment)}
          className="text-[10px] font-sans uppercase font-bold text-amber-800 dark:text-amber-400 hover:underline flex items-center gap-1 cursor-pointer"
        >
          <Plus className="w-3 h-3" />
          <span>{isAddingDepartment ? "Select" : "Add Custom"}</span>
        </button>
      </div>

      {isAddingDepartment ? (
        <div className="space-y-1.5 p-2 bg-secondary/30 border border-amber-800/40 dark:border-amber-400/40 rounded-xs animate-in fade-in duration-150">
          <input
            type="text"
            value={newDepartmentName}
            onChange={(e) => setNewDepartmentName(e.target.value)}
            placeholder="Enter custom department..."
            className="w-full text-xs font-serif p-1.5 bg-background border border-border focus:border-foreground focus:outline-none"
            autoFocus
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                e.preventDefault();
                onSaveCustomDepartment();
              }
            }}
          />
          <div className="flex gap-1.5">
            <button
              type="button"
              onClick={onSaveCustomDepartment}
              className="flex-1 px-2 py-1 bg-foreground text-background hover:bg-amber-800 hover:text-white text-[10px] font-sans uppercase font-bold tracking-wider rounded-xs cursor-pointer"
            >
              Save
            </button>
            <button
              type="button"
              onClick={() => {
                setIsAddingDepartment(false);
                setNewDepartmentName("");
              }}
              className="px-2 py-1 border border-border hover:bg-secondary text-[10px] font-sans uppercase font-bold text-muted-foreground rounded-xs cursor-pointer"
            >
              Cancel
            </button>
          </div>
        </div>
      ) : (
        <select
          value={category}
          onChange={(e) => {
            if (e.target.value === "__add_new__") {
              setIsAddingDepartment(true);
            } else {
              setCategory(e.target.value);
            }
          }}
          className="w-full font-serif text-sm p-2.5 bg-secondary/20 border border-border focus:border-foreground focus:outline-none"
        >
          {departmentsList.map((dep) => (
            <option key={dep} value={dep}>
              {dep}
            </option>
          ))}
          <option value="__add_new__">+ Add Custom Department...</option>
        </select>
      )}
    </div>
  );
}
