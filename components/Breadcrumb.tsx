import Link from 'next/link';

interface BreadcrumbProps {
  paths: { name: string; href: string }[];
  wordLimit?: number; // Optional prop for word limit
}

// Helper function to truncate text
const truncateText = (text: string, wordLimit: number) => {
  const words = text.split(' ');
  return words.length > wordLimit ? words.slice(0, wordLimit).join(' ') + '...' : text;
};

const Breadcrumb = ({ paths, wordLimit = 8 }: BreadcrumbProps) => {
  return (
    <nav className="breadcrumb">
      {paths.map((path, index) => (
        <span key={index}>
          <Link href={path.href}>{truncateText(path.name, wordLimit)}</Link>
          {index < paths.length - 1 && ' > '}
        </span>
      ))}
    </nav>
  );
};

export default Breadcrumb;
