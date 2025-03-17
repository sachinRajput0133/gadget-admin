import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useRouter } from 'next/router';
import { createArticle } from '../../store/slices/articlesSlice';
import ArticleForm from '../../components/articles/ArticleForm';
import { toast } from 'react-toastify';
import Layout from '../../components/layout/Layout';

const CreateArticle = () => {
  const dispatch = useDispatch();
  const router = useRouter();
  const { createUpdateLoading, createUpdateError } = useSelector((state) => state.articles);

  // Show error toast if creation fails
  React.useEffect(() => {
    if (createUpdateError) {
      toast.error(createUpdateError);
    }
  }, [createUpdateError]);

  const handleSubmit = async (data) => {
    try {
      // Format data for the API
      const articleData = {
        title: data.title,
        slug: data.slug,
        content: data.content,
        excerpt: data.excerpt,
        featuredImage: data.featuredImage,
        category: data.category,
        status: data.status,
        meta: {
          title: data.metaTitle,
          description: data.metaDescription,
          keywords: data.metaKeywords
        }
      };
      console.log("🚀 ~ handleSubmit ~ articleData:", articleData)

      // Dispatch create article action
      await dispatch(createArticle(articleData)).unwrap();
      toast.success('Article created successfully');
      router.push('/articles');
    } catch (error) {
      console.error('Error creating article:', error);
    }
  };

  return (
    <Layout title="Create Article">

      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold text-gray-800">Create Article</h1>
        </div>

      <div className="bg-white rounded-lg shadow-sm p-6">
        <ArticleForm 
          onSubmit={handleSubmit} 
          loading={createUpdateLoading} 
        />
      </div>
    </div>
    </Layout>
  );
};

export default CreateArticle;
