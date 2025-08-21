import Alpine from "alpinejs";

type SearchConfig = {
  endpoint?: string;
  placeholder?: string;
  display?: Record<string, string>;
  key?: string;
  minChars?: number;
  maxResults?: number;
  onSelect?: (item: any) => void;
};

type SearchItem = {
  [key: string]: any;
};

export function registerSearchComponent() {
  Alpine.data("searchable", (config: SearchConfig = {}) => ({

    endpoint: config.endpoint,
    placeholder: config.placeholder || "Search",
    display: config.display || { id: "id" },
    key: config.key || "id",
    minChars: config.minChars || 2,
    maxResults: config.maxResults || 5,
    onSelect: config.onSelect || ((item: SearchItem) => console.warn("No default select event added.", item)),

    // Component state
    search: "",
    results: [] as SearchItem[],
    isOpen: false,
    selectedIndex: -1,
    loading: false,

    get filteredResults(): SearchItem[] {
      return this.results;
    },

    async fetchResults(): Promise<void> {
      if (this.search.length < this.minChars) {
        this.results = [];
        this.isOpen = false;
        return;
      }

      this.loading = true;
      try {
        const response = await fetch(
          `${this.endpoint}?q=${encodeURIComponent(this.search)}&limit=${this.maxResults}`,
        );
        this.results = await response.json();
        this.isOpen = true;
      }
      catch (error) {
        console.error("Search failed:", error);
        this.results = [];
        this.isOpen = false;
      }
      finally {
        this.loading = false;
      }
    },

    getDisplay(item: SearchItem, key: string): string {
      const fieldName = this.display[key];
      return fieldName ? item[fieldName] || "" : "";
    },

    onSelectItem(item: SearchItem): void {
      this.search = item[this.display.id];
      this.isOpen = false;
      this.selectedIndex = -1;
      this.onSelect(item);
    },

    onKeydown(event: KeyboardEvent): void {
      if (!this.isOpen)
        return;

      switch (event.key) {
        case "ArrowDown":
          event.preventDefault();
          this.selectedIndex = Math.min(
            this.selectedIndex + 1,
            this.filteredResults.length - 1,
          );
          break;
        case "ArrowUp":
          event.preventDefault();
          this.selectedIndex = Math.max(this.selectedIndex - 1, -1);
          break;
        case "Enter":
          event.preventDefault();
          if (this.selectedIndex >= 0 && this.filteredResults[this.selectedIndex]) {
            this.onSelectItem(this.filteredResults[this.selectedIndex]);
          }
          break;
        case "Escape":
          this.isOpen = false;
          this.selectedIndex = -1;
          break;
      }
    },

    onFocus(): void {
      if (this.results.length > 0) {
        this.isOpen = true;
      }
    },

    onClickAway(): void {
      this.isOpen = false;
      this.selectedIndex = -1;
    },
  }));
}
