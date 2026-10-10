package com.nightdrop.service;

import com.nightdrop.dto.ProductDto;
import com.nightdrop.dto.ProductRequest;
import com.nightdrop.entity.Product;
import com.nightdrop.entity.ProductCategory;
import com.nightdrop.entity.Role;
import com.nightdrop.entity.Store;
import com.nightdrop.entity.User;
import com.nightdrop.exception.BadRequestException;
import com.nightdrop.exception.ResourceNotFoundException;
import com.nightdrop.exception.UnauthorizedException;
import com.nightdrop.repository.ProductRepository;
import com.nightdrop.repository.StoreRepository;
import com.nightdrop.util.TimeUtil;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class ProductService {

    private final ProductRepository productRepository;
    private final StoreRepository storeRepository;
    private final TimeUtil timeUtil;

    public ProductService(ProductRepository productRepository, StoreRepository storeRepository, TimeUtil timeUtil) {
        this.productRepository = productRepository;
        this.storeRepository = storeRepository;
        this.timeUtil = timeUtil;
    }

    @Transactional(readOnly = true)
    public List<ProductDto> getAllProducts() {
        return productRepository.findAllByOrderByCreatedAtDesc()
                .stream()
                .map(this::mapToDto)
                .collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public List<ProductDto> getAvailableProducts() {
        return productRepository.findByIsAvailableTrue()
                .stream()
                .map(this::mapToDto)
                .collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public ProductDto getProductById(Long id) {
        Product product = productRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Product not found with id: " + id));
        return mapToDto(product);
    }

    @Transactional(readOnly = true)
    public List<ProductDto> searchProducts(String query) {
        if (query == null || query.isBlank()) {
            return getAvailableProducts();
        }
        return productRepository.searchAvailableProducts(query.trim())
                .stream()
                .map(this::mapToDto)
                .collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public List<ProductDto> getProductsByCategory(ProductCategory category) {
        return productRepository.findByCategoryAndIsAvailableTrue(category)
                .stream()
                .map(this::mapToDto)
                .collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public List<ProductDto> getProductsByStore(Long storeId) {
        return productRepository.findByStoreId(storeId)
                .stream()
                .map(this::mapToDto)
                .collect(Collectors.toList());
    }

    @Transactional
    public ProductDto createProduct(ProductRequest request, User currentUser) {
        Long storeId = request.getStoreId();
        Store store;

        if (currentUser.getRole() == Role.ADMIN) {
            if (storeId == null) {
                throw new BadRequestException("Store ID is required for product creation");
            }
            store = storeRepository.findById(storeId)
                    .orElseThrow(() -> new ResourceNotFoundException("Store not found with id: " + storeId));
        } else {
            if (storeId != null) {
                store = storeRepository.findById(storeId)
                        .orElseThrow(() -> new ResourceNotFoundException("Store not found with id: " + storeId));
                if (!store.getOwner().getId().equals(currentUser.getId())) {
                    throw new UnauthorizedException("You can only add products to your own store");
                }
            } else {
                List<Store> ownerStores = storeRepository.findByOwnerIdOrderByIdDesc(currentUser.getId());
                if (ownerStores.isEmpty()) {
                    throw new BadRequestException("You must create or be assigned a store before adding products");
                }
                store = ownerStores.get(0);
            }
        }

        Product product = Product.builder()
                .store(store)
                .name(request.getName().trim())
                .description(request.getDescription())
                .category(request.getCategory())
                .price(request.getPrice())
                .stockQuantity(request.getStockQuantity())
                .imageUrl(request.getImageUrl())
                .isAvailable(request.getIsAvailable() != null ? request.getIsAvailable() : true)
                .build();

        Product savedProduct = productRepository.save(product);
        return mapToDto(savedProduct);
    }

    @Transactional
    public ProductDto updateProduct(Long id, ProductRequest request, User currentUser) {
        Product product = productRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Product not found with id: " + id));

        boolean isOwner = product.getStore().getOwner().getId().equals(currentUser.getId());
        boolean isAdmin = currentUser.getRole() == Role.ADMIN;
        if (!isOwner && !isAdmin) {
            throw new UnauthorizedException("You are not authorized to update products in this store");
        }

        product.setName(request.getName().trim());
        product.setDescription(request.getDescription());
        product.setCategory(request.getCategory());
        product.setPrice(request.getPrice());
        product.setStockQuantity(request.getStockQuantity());
        if (request.getImageUrl() != null && !request.getImageUrl().isBlank()) {
            product.setImageUrl(request.getImageUrl());
        }
        if (request.getIsAvailable() != null) {
            product.setIsAvailable(request.getIsAvailable());
        }

        Product updatedProduct = productRepository.save(product);
        return mapToDto(updatedProduct);
    }

    @Transactional
    public void deleteProduct(Long id, User currentUser) {
        Product product = productRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Product not found with id: " + id));

        boolean isOwner = product.getStore().getOwner().getId().equals(currentUser.getId());
        boolean isAdmin = currentUser.getRole() == Role.ADMIN;
        if (!isOwner && !isAdmin) {
            throw new UnauthorizedException("You are not authorized to delete products in this store");
        }

        productRepository.delete(product);
    }

    public ProductDto mapToDto(Product product) {
        boolean isStoreOpen = false;
        if (product.getStore() != null) {
            isStoreOpen = timeUtil.isStoreOpen(product.getStore());
        }

        return ProductDto.builder()
                .id(product.getId())
                .storeId(product.getStore() != null ? product.getStore().getId() : null)
                .storeName(product.getStore() != null ? product.getStore().getName() : null)
                .name(product.getName())
                .description(product.getDescription())
                .category(product.getCategory())
                .categoryDisplayName(product.getCategory() != null ? product.getCategory().getDisplayName() : null)
                .price(product.getPrice())
                .stockQuantity(product.getStockQuantity())
                .imageUrl(product.getImageUrl())
                .isAvailable(product.getIsAvailable())
                .isStoreOpen(isStoreOpen)
                .createdAt(product.getCreatedAt())
                .build();
    }
}
