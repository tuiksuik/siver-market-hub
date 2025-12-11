import { Link } from "react-router-dom";

interface CategoryCardProps {
  label: string;
  image: string;
  href?: string;
}

const CategoryCard = ({ label, image, href = '#' }: CategoryCardProps) => {
  return (
    <Link to={href} className="group flex flex-col items-center text-center">
      <div className="w-28 h-28 md:w-32 md:h-32 rounded-full overflow-hidden bg-gray-100 flex items-center justify-center mb-3 transition-transform transform group-hover:scale-105">
        <img src={image} alt={label} className="w-full h-full object-cover" />
      </div>
      <div className="text-sm md:text-base text-gray-800 max-w-xs">
        {label}
      </div>
    </Link>
  );
};

export default CategoryCard;
