// User DTO: Sanitizes user data
exports.userDTO = (user) => {
    if (!user) {
      console.error('userDTO received undefined or null user');
      return null;
    }
  
    return {
      id: user._id,
      name: user.name,
      email: user.email,
      userType: user.userType,
      profilePicture: user.profilePicture,
      bio: user.bio || null,
      categories: user.categories || [],
      website: user.website || null,
      socialLinks: user.socialLinks || {
        facebook: null,
        instagram: null,
        twitter: null,
      },
      location: user.location || null,
      hourlyRate: user.hourlyRate || null,
      gallery: user.gallery || [],
      createdAt: user.createdAt,
      updatedAt: user.updatedAt,
    };
  };
  
  
  // User List DTO: For multiple users
  exports.userListDTO = (users) => users.map((user) => this.userDTO(user));
  
  
// Service DTO: Sanitizes service data
exports.serviceDTO = (service) => {
    if (!service) return null;
  
    return {
      id: service._id,
      title: service.title,
      description: service.description,
      category: service.category,
      price: service.price,
      rating: service.rating || 0,
      reviewCount: service.reviewCount || 0,
      photoUrl: service.photoUrl || null,
      providerId: service.provider,
      createdAt: service.createdAt,
      updatedAt: service.updatedAt,
    };
  };
  
  // Service List DTO: For multiple services
  exports.serviceListDTO = (services) => services.map((service) => this.serviceDTO(service));
  