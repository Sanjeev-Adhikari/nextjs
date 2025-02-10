"use client";

import { useFetchAllTestimonials } from "@/hooks/testimonialHooks";
import { useState } from "react";
import { TestimonialData } from "@/interfaces/testimonial";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Loader2 } from "lucide-react";
import toast, { Toaster } from "react-hot-toast";

const Page = () => {
  const testimonials: TestimonialData[] | null = useFetchAllTestimonials();

  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [selectedTestimonial, setSelectedTestimonial] = useState<TestimonialData | null>(null);
  const [isAddFormOpen, setIsAddFormOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const [formData, setFormData] = useState({
    name: "",
    rating:"",
    testimonial: "",
    imageUrl: null as File | null,
  });

  const handleAddFormOpen = () => setIsAddFormOpen(true);
  const handleAddFormClose = () => {
    setIsAddFormOpen(false);
    setFormData({ name: "", rating: "", testimonial: "", imageUrl: null });
  };

  const handleViewClick = (testimonial: TestimonialData) => {
    setSelectedTestimonial(testimonial);
    setIsDrawerOpen(true);
  };

  const handleDrawerClose = () => {
    setIsDrawerOpen(false);
    setSelectedTestimonial(null);
  };

  const handleDeleteClick = async (_id: string) => {
    setDeletingId(_id);
    try {
      const response = await fetch(`/api/testimonial/${_id}`, { method: "DELETE" });
      const data = await response.json();

      if (data.success) {
        toast.success("Testimonial deleted successfully!");
        window.location.reload();
      } else {
        toast.error(`Failed to delete testimonial: ${data.message}`);
      }
    } catch (error) {
      toast.error("An error occurred while deleting the testimonial.");
    } finally {
      setDeletingId(null);
    }
  };
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, files } = e.target;
    if (files && files[0]) {
      setFormData((prev) => ({ ...prev, [name]: files[0] }));
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    const testimonialData = new FormData();
    testimonialData.append("name", formData.name);
    testimonialData.append("rating", formData.rating);
    testimonialData.append("testimonial", formData.testimonial);    
    if(formData.imageUrl) testimonialData.append("imageUrl", formData.imageUrl);

    try {
      const response = await fetch("/api/testimonial", {
        method: "POST",
        body: testimonialData,
      });

      const data = await response.json();
      console.log("data", data);
      if (data.success) {
        toast.success("Testimonial added successfully!");
        handleAddFormClose();
        window.location.reload();
      } else {
        toast.error(`Failed to add testimonial: ${data.message}`);
      }
    } catch (error) {
      toast.error("An error occurred while adding the testimonial.");
    } finally {
      setIsLoading(false);
    }
  };

  if (!testimonials) return   <div className="flex items-center justify-center h-full">
  <Loader2 className="animate-spin text-gray-500" size={32} />
</div>

  return (
    <div className="p-4">
      <div className="flex justify-between mb-4">
        <h1 className="text-2xl font-bold">Testimonials</h1>
        <Button onClick={handleAddFormOpen}>Add Testimonial</Button>
      </div>

      <Table>
        <TableHeader className="bg-gray-100">
          <TableRow>
            <TableHead>Name</TableHead>
            <TableHead>Rating</TableHead>
            <TableHead>Testimonial</TableHead>
            <TableHead>Image</TableHead>
            <TableHead>Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {testimonials.map((testimonial) => (
            <TableRow key={testimonial._id}>
              <TableCell>{testimonial.name}</TableCell>
              <TableCell>{testimonial.rating}</TableCell>
              <TableCell>{testimonial.testimonial}</TableCell>
              <TableCell>
                <img src={testimonial.imageUrl} alt="User" className="h-12 w-12 rounded-full object-cover" />
              </TableCell>
              <TableCell>
                <button className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600" onClick={() => handleViewClick(testimonial)}>View</button>
                <Button
                  variant="destructive"
                  onClick={() => handleDeleteClick(testimonial._id)}
                  disabled={deletingId === testimonial._id}
                >
                  {deletingId === testimonial._id ? <Loader2 className="animate-spin" /> : "Delete"}
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>

      {isDrawerOpen && selectedTestimonial && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-end z-50">
          <div className="w-1/3 bg-white h-full shadow-lg p-4">
            <button className="text-white bg-red-500 px-4 py-2 rounded-md" onClick={handleDrawerClose}>
              Close
            </button>
            <h2 className="text-xl font-bold mt-4">{selectedTestimonial.name}</h2>
            <p className="mt-2">
              <strong>Rating:</strong> {selectedTestimonial.rating}
            </p>
            <p className="mt-2">
              <strong>Testimonial:</strong> {selectedTestimonial.testimonial}
            </p>
            <img
              src={selectedTestimonial.imageUrl}
              alt={selectedTestimonial.name}
              className="mt-4 rounded-full"
            />
          </div>
        </div>
      )}

      {isAddFormOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-end z-50">
          <div className="w-1/3 bg-white h-full shadow-lg p-4">
            <button className="text-white bg-red-500 px-4 py-2 rounded-md" onClick={handleAddFormClose}>
              Close
            </button>
            <h2 className="text-xl font-bold mt-4">Add Testimonial</h2>
            <form onSubmit={handleSubmit} className="mt-4 space-y-4">
              <div>
                <label className="block text-sm font-medium">Name</label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border rounded"
                  placeholder="Enter name"
                />
              </div>
              <div>
                <label className="block text-sm font-medium">Rating</label>
                <input
                  type="number"
                  name="rating"
                  value={formData.rating}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border rounded"
                  placeholder="Enter rating"
                />
              </div>
              <div>
                <label className="block text-sm font-medium">Testimonial</label>
                <textarea
                  name="testimonial"
                  value={formData.testimonial}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border rounded"
                  placeholder="Enter testimonial"
                ></textarea>
              </div>
              <div>
                <label className="block text-sm font-medium">Image URL</label>
                <input
                  type="file"
                  name="imageUrl"
                 
                  onChange={handleFileChange}
                  className="w-full px-3 py-2 border rounded"
                  placeholder="Enter image URL"
                />
              </div>
              <Button type="submit" disabled={isLoading} className="w-full">
                {isLoading ? (<><Loader2 className="animate-spin" /> creating testimonial...</>)  : "Submit"}
              </Button>
            </form>
          </div>
        </div>
      )}

      <Toaster />
    </div>
  );
};

export default Page;
