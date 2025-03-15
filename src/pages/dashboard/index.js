import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchArticles } from '../../store/slices/articlesSlice';
import { fetchCategories } from '../../store/slices/categoriesSlice';
import { fetchSections } from '../../store/slices/sectionsSlice';

// Icons
import ArticleIcon from '@mui/icons-material/Article';
import CategoryIcon from '@mui/icons-material/Category';
import ViewCarouselIcon from '@mui/icons-material/ViewCarousel';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';
import CustomLink from '../../widget/customLink';

const Dashboard = () => {
  const dispatch = useDispatch();
  const { articles, pagination: articlePagination } = useSelector((state) => state.articles);
  const { categories, pagination: categoryPagination } = useSelector((state) => state.categories);
  const { sections, pagination: sectionPagination } = useSelector((state) => state.sections);

  useEffect(() => {
    dispatch(fetchArticles({ limit: 5 }));
    dispatch(fetchCategories({ limit: 5 }));
    dispatch(fetchSections({ limit: 5 }));
  }, [dispatch]);

  const stats = [
    {
      title: 'Total Articles',
      value: articlePagination?.total || 0,
      icon: <ArticleIcon className="h-6 w-6 text-primary-600" />,
      link: '/articles',
      color: 'bg-blue-50',
    },
    {
      title: 'Total Categories',
      value: categoryPagination?.total || 0,
      icon: <CategoryIcon className="h-6 w-6 text-green-600" />,
      link: '/categories',
      color: 'bg-green-50',
    },
    {
      title: 'Total Sections',
      value: sectionPagination?.total || 0,
      icon: <ViewCarouselIcon className="h-6 w-6 text-purple-600" />,
      link: '/sections',
      color: 'bg-purple-50',
    },
    {
      title: 'Published Articles',
      value: articles?.filter(article => article.status === 'published')?.length || 0,
      icon: <TrendingUpIcon className="h-6 w-6 text-yellow-600" />,
      link: '/articles?status=published',
      color: 'bg-yellow-50',
    },
  ];

  return (
    <div className="space-y-8">
      <h1 className="text-2xl font-bold text-gray-800">Dashboard</h1>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat) => (
          <CustomLink href={stat.link} key={stat.title}>
            {/* <a className={`${stat.color} rounded-lg shadow-sm p-6 transition-transform hover:scale-105`}> */}
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">{stat.title}</p>
                  <p className="mt-2 text-3xl font-semibold text-gray-900">{stat.value}</p>
                </div>
                <div>{stat.icon}</div>
              </div>
            {/* </a> */}
          </CustomLink>
        ))}
      </div>

      {/* Recent Articles */}
      <div className="bg-white rounded-lg shadow-sm p-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold text-gray-800">Recent Articles</h2>
          <CustomLink href="/articles">
            <div className="text-sm text-primary-600 hover:text-primary-700">View All</div>
          </CustomLink>
        </div>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Title
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Category
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Created At
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {articles?.slice(0, 5).map((article) => (
                <tr key={article._id}>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <CustomLink href={`/articles/edit/${article._id}`}>
                      <div className="text-sm font-medium text-gray-900 hover:text-primary-600">
                        {article.title}
                      </div>
                    </CustomLink>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="text-sm text-gray-500">
                      {article.category ? article.category.title : 'No Category'}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                      article.status === 'published' 
                        ? 'bg-green-100 text-green-800' 
                        : 'bg-yellow-100 text-yellow-800'
                    }`}>
                      {article.status === 'published' ? 'Published' : 'Draft'}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {new Date(article.createdAt).toLocaleDateString()}
                  </td>
                </tr>
              ))}
              {articles?.length === 0 && (
                <tr>
                  <td colSpan="4" className="px-6 py-4 text-center text-sm text-gray-500">
                    No articles found
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Recent Categories & Sections */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Categories */}
        <div className="bg-white rounded-lg shadow-sm p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-gray-800">Recent Categories</h2>
            <CustomLink href="/categories">
              <div className="text-sm text-primary-600 hover:text-primary-700">View All</div>
            </CustomLink>
          </div>
          <div className="overflow-y-auto max-h-72">
            <ul className="divide-y divide-gray-200">
              {categories?.slice(0, 5).map((category) => (
                <li key={category._id} className="py-3">
                  <CustomLink href={`/categories/edit/${category.slug}`}>
                    <div className="flex items-center space-x-3 hover:bg-gray-50 p-2 rounded-md">
                      <CategoryIcon className="h-5 w-5 text-green-500" />
                      <div>
                        <p className="text-sm font-medium text-gray-900">{category.title}</p>
                        <p className="text-xs text-gray-500">Slug: {category.slug}</p>
                      </div>
                    </div>
                  </CustomLink>
                </li>
              ))}
              {categories?.length === 0 && (
                <li className="py-3 text-center text-sm text-gray-500">
                  No categories found
                </li>
              )}
            </ul>
          </div>
        </div>

        {/* Recent Sections */}
        <div className="bg-white rounded-lg shadow-sm p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-gray-800">Recent Sections</h2>
            <CustomLink href="/sections">
              <div className="text-sm text-primary-600 hover:text-primary-700">View All</div>
            </CustomLink>
          </div>
          <div className="overflow-y-auto max-h-72">
            <ul className="divide-y divide-gray-200">
              {sections?.slice(0, 5).map((section) => (
                <li key={section._id} className="py-3">
                  <CustomLink href={`/sections/edit/${section._id}`}>
                    <div className="flex items-center space-x-3 hover:bg-gray-50 p-2 rounded-md">
                      <ViewCarouselIcon className="h-5 w-5 text-purple-500" />
                      <div>
                        <p className="text-sm font-medium text-gray-900">{section.title}</p>
                        <p className="text-xs text-gray-500">
                          {section.articles?.length || 0} Articles
                        </p>
                      </div>
                    </div>
                  </CustomLink>
                </li>
              ))}
              {sections?.length === 0 && (
                <li className="py-3 text-center text-sm text-gray-500">
                  No sections found
                </li>
              )}
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
