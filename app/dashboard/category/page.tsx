"use client";

import { useFetchAllCategories } from "@/hooks/categoryHooks";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Loader2 } from "lucide-react";
import { useState } from "react";
import { toast, Toaster } from "react-hot-toast";
import { Button } from "@/components/ui/button";

const Page = () => {
  const [selectedCategory, setSelectedCategory] = useState<any | null>(null);
  const [isViewDrawerOpen, setIsViewDrawerOpen] = useState(false);
  const [isAddDrawerOpen, setIsAddDrawerOpen] = useState(false);
  const [isEditDrawerOpen, setIsEditDrawerOpen] = useState(false);
  const [newCategoryName, setNewCategoryName] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const categories = useFetchAllCategories();

  const handleViewClick = (category: any) => {
    setSelectedCategory(category);
    setIsViewDrawerOpen(true);
  };

  const handleAddCategory = () => {
    setIsAddDrawerOpen(true);
  };

  const handleEditClick = (category: any) => {
    setSelectedCategory(category);
    setNewCategoryName(category.categoryName);
    setIsEditDrawerOpen(true);
  };

  const handleCloseDrawer = () => {
    setIsViewDrawerOpen(false);
    setIsAddDrawerOpen(false);
    setIsEditDrawerOpen(false);
    setSelectedCategory(null);
    setNewCategoryName("");
  };

  const handleDeleteCategory = async (categoryId: string) => {
    const confirmation = window.confirm("Are you sure you want to delete this category?");
    if (confirmation) {
      try {
        const response = await fetch(`/api/category/${categoryId}`, {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json",
          },
        });
        const data = await response.json();
        if (data.success) {
          toast.success("Category deleted successfully.");
          handleCloseDrawer();
          window.location.reload();
        } else {
          toast.error("Failed to delete category: " + data.message);
        }
      } catch (error) {
        console.error("Error deleting category:", error);
        toast.error("Error deleting category. Please try again.");
      }
    }
  };

  const handleSubmitCategory = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    const newCategory = {
      categoryName: newCategoryName,
     
    };

    try {
      const response = await fetch("/api/category", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(newCategory),
      });

      const data = await response.json();
      if (data.success) {
        toast.success("Category added successfully.");
        handleCloseDrawer();
        window.location.reload();
      } else {
        toast.error("Failed to add category: " + data.message);
      }
    } catch (error) {
      console.error("Error adding category:", error);
      toast.error("Error adding category. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleEditCategory = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    const updatedCategory = {
      categoryName: newCategoryName,
      
    };

    try {
      const response = await fetch(`/api/category/${selectedCategory._id}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(updatedCategory),
      });

      const data = await response.json();
      if (data.success) {
        toast.success("Category updated successfully.");
        handleCloseDrawer();
        window.location.reload();
      } else {
        toast.error("Failed to update category: " + data.message);
      }
    } catch (error) {
      console.error("Error updating category:", error);
      toast.error("Error updating category. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  if (!categories) {
    return (
      <div className="flex items-center justify-center h-full">
        <Loader2 className="animate-spin text-gray-500" size={32} />
      </div>
    );
  }

  return (
    <div className="p-4">
      <div className="flex justify-between mb-4">
        <h1 className="text-2xl font-bold">Categories</h1>
        <Button onClick={handleAddCategory}>Add Category</Button>
      </div>

      {categories.length === 0 ? (
        <p className="text-gray-500">No categories available.</p>
      ) : (
        <Table>
          <TableHeader className="bg-gray-100">
            <TableRow>
              <TableHead>Name</TableHead>
              <TableHead className="text-end pr-[100px]">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {categories.map((category: any) => (
              <TableRow key={category._id}>
                <TableCell>{category.categoryName}</TableCell>
                <TableCell className="text-end pr-6">
                  <button
                    className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
                    onClick={() => handleViewClick(category)}
                  >
                    View
                  </button>
                  <button
                    className="px-4 py-2 bg-yellow-500 text-white rounded hover:bg-yellow-600 ml-2"
                    onClick={() => handleEditClick(category)}
                  >
                    Edit
                  </button>
                  <button
                    className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600 ml-2"
                    onClick={() => handleDeleteCategory(category._id)}
                  >
                    Delete
                  </button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      )}

      {/* View Category Drawer */}
      {isViewDrawerOpen && selectedCategory && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-end z-50">
          <div className="w-1/3 bg-white h-full shadow-lg p-4 overflow-auto">
            <button
              className="text-white bg-red-500 px-4 py-2 rounded-md"
              onClick={handleCloseDrawer}
            >
              Close
            </button>
            <h2 className="text-xl text-gray-700 mt-4 font-semibold">Category Name: {selectedCategory.categoryName}</h2>
          </div>
        </div>
      )}

      {/* Add Category Drawer */}
      {isAddDrawerOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-end z-50">
          <div className="w-1/3 bg-white h-full shadow-lg p-4 overflow-auto">
            <button
              className="text-white bg-red-500 px-4 py-2 rounded-md"
              onClick={handleCloseDrawer}
            >
              Close
            </button>
            <h2 className="text-xl font-bold mt-4">Add New Category</h2>

            <form className="mt-4" onSubmit={handleSubmitCategory}>
              <div className="mb-4">
                <label htmlFor="categoryName" className="block text-sm font-medium text-gray-700">
                  Category Name
                </label>
                <input
                  type="text"
                  id="categoryName"
                  value={newCategoryName}
                  onChange={(e) => setNewCategoryName(e.target.value)}
                  className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  required
                />
              </div>
              <Button type="submit" disabled={isLoading}>
                {isLoading ? (
                  <>
                  <Loader2 className="animate-spin" size={16} /> Adding Category...</>
                ) : "Add Category"}
              </Button>
            </form>
          </div>
        </div>
      )}

      {/* Edit Category Drawer */}
      {isEditDrawerOpen && selectedCategory && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-end z-50">
          <div className="w-1/3 bg-white h-full shadow-lg p-4 overflow-auto">
            <button
              className="text-white bg-red-500 px-4 py-2 rounded-md"
              onClick={handleCloseDrawer}
            >
              Close
            </button>
            <h2 className="text-xl font-bold mt-4">Edit Category</h2>

            <form className="mt-4" onSubmit={handleEditCategory}>
              <div className="mb-4">
                <label htmlFor="editCategoryName" className="block text-sm font-medium text-gray-700">
                  Category Name
                </label>
                <input
                  type="text"
                  id="editCategoryName"
                  value={newCategoryName}
                  onChange={(e) => setNewCategoryName(e.target.value)}
                  className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  required
                />
              </div>
            
              <Button type="submit" disabled={isLoading}>
                {isLoading ? (<>
                  <Loader2 className="animate-spin" size={16} />Updating Category...</>) : "Update Category"}
              </Button>
            </form>
          </div>
        </div>
      )}

      <Toaster position="top-center" />
    </div>
  );
};

export default Page;
