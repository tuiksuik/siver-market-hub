import CategoryCard from "./CategoryCard";

interface Category {
  id: string;
  label: string;
  image: string;
  href?: string;
}

interface CategoryGridProps {
  categories: Category[];
}

const CategoryGrid = ({ categories }: CategoryGridProps) => {
  return (
    <section className="container mx-auto px-4 py-10">
      <div className="max-w-screen-xl mx-auto">
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 xl:grid-cols-8 gap-8 justify-items-center">
          {categories.map((cat) => (
            <div key={cat.id} className="w-full flex flex-col items-center">
              <CategoryCard label={cat.label} image={cat.image} href={cat.href} />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default CategoryGrid;
