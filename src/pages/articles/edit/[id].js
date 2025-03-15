import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useRouter } from 'next/router';
import { fetchArticleById, updateArticle, clearArticle } from '../../../store/slices/articlesSlice';
import ArticleForm from '../../../components/articles/ArticleForm';
import { toast } from 'react-toastify';

const EditArticle = () => {
  const dispatch = useDispatch();
  const router = useRouter();
  const { id } = router.query;
  const { article, loading, createUpdateLoading, error, createUpdateError } = useSelector(
    (state) => state.articles
  );

  // Fetch article on component mount
  useEffect(() => {
    if (id) {
      dispatch(fetchArticleById(id));
    }

    // Clean up article state on unmount
    return () => {
      dispatch(clearArticle());
    };
  }, [dispatch, id]);

  // Show error toasts
  useEffect(() => {
    if (error) {
      toast.error(error);
    }
    if (createUpdateError) {
      toast.error(createUpdateError);
    }
  }, [error, createUpdateError]);

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

      // Dispatch update article action
      await dispatch(updateArticle({ id, articleData })).unwrap();
      toast.success('Article updated successfully');
      router.push('/articles');
    } catch (error) {
      console.error('Error updating article:', error);
    }
  };

  // Show loading state when fetching article
  if (loading && !article) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="loader"></div>
      </div>
    );
  }

  // Show error message if article not found
  if (!loading && !article && !error) {
    return (
      <div className="bg-white rounded-lg shadow-sm p-6 text-center">
        <h2 className="text-xl text-red-600 mb-2">Article Not Found</h2>
        <p className="text-gray-600 mb-4">The article you are looking for does not exist or has been removed.</p>
        <button
          onClick={() => router.push('/articles')}
          className="btn-primary"
        >
          Back to Articles
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-800">Edit Article</h1>
      </div>

      {article && (
        <div className="bg-white rounded-lg shadow-sm p-6">
          <ArticleForm 
            initialData={article}
            onSubmit={handleSubmit} 
            loading={createUpdateLoading} 
          />
        </div>
      )}
    </div>
  );
};

export default EditArticle;
