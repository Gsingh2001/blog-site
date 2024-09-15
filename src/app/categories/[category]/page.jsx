import { fetchData } from '@/utils/fetchData';
import Link from 'next/link';

const CategoryPage = async ({ params }) => {
    const { category } = params;
    const data = await fetchData(); // Fetch all blog posts
    const filteredData = data.filter(post => post.category && post.category.includes(category));

    if (!filteredData.length) return <div>No posts available for this category.</div>;

    return (
        <div className="bg-gray-100 min-h-screen py-8 px-4 sm:px-6 lg:px-8">
            <div className="max-w-4xl mx-auto">
                <h1 className="text-3xl font-extrabold text-gray-900 mb-6">
                    {category}
                </h1>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                    {filteredData.map(item => (
                        <div key={item.id} className="text-gray-200 bg-gray-200 shadow-lg rounded-lg overflow-hidden">
                            <img
                                src={item.main_image}
                                alt={item.title}
                                className="w-full h-48 object-cover"
                            />
                            <div className="p-4">
                                <h2 className="text-xl font-semibold text-gray-800 mb-2">{item.title}</h2>
                                <p className="text-gray-600">{item.content[0]}</p>
                                <Link href={`/blog/${item.id}`} className="text-blue-600 hover:underline mt-2 inline-block">
                                    Learn More
                                </Link>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

// Function to generate static paths for categories
export async function generateStaticParams() {
    const data = await fetchData(); // Fetch all blog posts
    const categories = [...new Set(data.flatMap(post => post.category))]; // Extract unique categories from posts

    // Generate paths for each category
    return categories.map(category => ({
        category,
    }));
}

export default CategoryPage;
