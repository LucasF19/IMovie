import { Component, OnInit } from '@angular/core';
import { MovieService } from '../../services/movie.service';
import { Genre } from '../../interfaces/home-interface';
import { ActivatedRoute, Router } from '@angular/router';
import { convertRuntime } from 'src/app/shared/formatters/currect-hour';
import { FavoriteService } from 'src/app/modules/favorites/services/favorites.service';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';

@Component({
  selector: 'card-description',
  templateUrl: './card-description.html',
  styleUrls: ['./card-description.scss'],
})
export class CardDescription implements OnInit {
  isLoading = true;
  typesMovie: Genre[] = [];
  cast: any[] = [];
  similarMovies: any[] = [];
  reviews: any[] = [];
  movieId!: string;
  movieDetails: any;
  isExpanded: any = {};
  watchProviders: any;
  showModal = false;
  providersList: any;
  favorite!: boolean; 

  movieImages: any[] = [];
  selectedImage: string | null = null;
  selectedImageIndex: number = 0;

  showTrailer = false;

  constructor(
    private route: ActivatedRoute,
    private movieService: MovieService,
    private router: Router,
    private favoriteService: FavoriteService,
    private sanitizer: DomSanitizer
  ) {}

  ngOnInit(): void {
    this.movieId = this.route.snapshot.paramMap.get('id') ?? '';
    this.fetchMovieDetails(this.movieId);
  }

  fetchMovieDetails(id: string): void {
    this.movieService.getMovieDetails(id).subscribe({
      next: (data) => {
        const savedFavorites: any = JSON.parse(localStorage.getItem('favoriteMovies') ?? '[]');
        this.movieDetails = data;
        this.favorite = savedFavorites?.filter((item: { id: string }) => item.id == this.movieId)?.length > 0;
  
        this.getSimilarMovies(data.genres[0]?.id);
        this.moviesCredit(id);
        this.getComments(id);
        this.getMovieVideos(id);
        this.getMovieImages(id);
      },
      error: () => { this.isLoading = false; }
    });
  }

  getMovieVideos(movieId: string): void {
    this.movieService.getMovieVideos(movieId).subscribe({
      next: (data) => {
        this.movieDetails.videos = data;
      }
    });
  }
  
  getMovieImages(movieId: string): void {
    this.movieService.getMovieImages(movieId).subscribe({
      next: (data) => {
        this.movieImages = data.backdrops?.slice(0, 12) ?? [];
      }
    });
  }
  
  getTrailerUrl(): SafeResourceUrl | null {
    const trailer = this.movieDetails?.videos?.results?.find(
      (video: any) => video.site === 'YouTube' && video.type === 'Trailer'
    );

    if (!trailer?.key) return null;

    return this.sanitizer.bypassSecurityTrustResourceUrl(
      `https://www.youtube.com/embed/${trailer.key}?rel=0`
    );
  }

  getSimilarMovies(genreId: number): void {
    if (genreId) {
      this.movieService.getMoviesByGenre(genreId).subscribe({
        next: (similar) => {
          this.similarMovies = similar.results;
          this.isLoading = false;
        },
        error: (error) => {
          this.isLoading = false;
        }
      });
    }
  }

  moviesCredit(movieId: string): void {
    this.movieService.getMovieCredits(movieId).subscribe({
      next: (credits) => {
        this.cast = credits.cast;
      },
      error: (error) => {
        console.error('Error fetching movie credits:', error);
      }
    });
  }

  getComments(movieId: string): void{
    this.movieService.getMovieReviews(movieId).subscribe({
      next: (reviews) => {
        this.reviews = reviews.results;
      },
      error: (error) => {
        console.error('Error fetching movie reviews:', error);
      }
    });
  }

  getTrailerKey(): string | null {
    const trailer = this.movieDetails?.videos?.results?.find(
      (video: any) =>
        video.site === 'YouTube' &&
        video.type === 'Trailer'
    );
  
    return trailer?.key || null;
  }

  truncateContent(content: string, wordLimit: number): string {
    const words = content.split('');
    
    if (words.length > wordLimit) {
      return words.slice(0, wordLimit).join('') + '...';
    }
    return content;
  }

  toggleReadMore(id: any) {
    this.isExpanded[id] = !this.isExpanded[id];
  }

  getWatchProviders() {
    this.movieService.getWatchProviders(this.movieId).subscribe(data => {
      this.watchProviders = data.results.BR;
      this.showModal = true;
    });
  }

  toggleFavorite() {
    this.favorite = !this.favorite;

    if (this.favorite) {
      this.favoriteService.addFavorite(this.movieDetails);
    } else {
      this.favoriteService.removeFavorite(this.movieDetails);
    }
  }

  onCloseModal() {
    this.showModal = false;
  }

  goLastPage(){
    window.history.back();
  }

  goHome(){
    this.router.navigate(['/home']);
  }

  getReleaseYear(dateString: string): number {
    return new Date(dateString).getFullYear();
  }

  convertRuntime(runtime: number): string {
    return convertRuntime(runtime);
  }

  openImage(index: number): void {
    this.selectedImageIndex = index;
    this.selectedImage = 'https://image.tmdb.org/t/p/original' + this.movieImages[index].file_path;
  }

  prevImage(): void {
    this.selectedImageIndex = (this.selectedImageIndex - 1 + this.movieImages.length) % this.movieImages.length;
    this.selectedImage = 'https://image.tmdb.org/t/p/original' + this.movieImages[this.selectedImageIndex].file_path;
  }

  nextImage(): void {
    this.selectedImageIndex = (this.selectedImageIndex + 1) % this.movieImages.length;
    this.selectedImage = 'https://image.tmdb.org/t/p/original' + this.movieImages[this.selectedImageIndex].file_path;
  }

  closeImage(): void {
    this.selectedImage = null;
  }
}
