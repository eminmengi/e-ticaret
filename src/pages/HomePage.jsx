import CategoryPick from "../components/home-components/CategoryPick";
import HeroSlider from "../components/home-components/HeroSlider";
import FavProducts from "../components/home-components/FavProducts";
import BottomSlider from "../components/home-components/BottomSlider";

export default function Home() {
  return (
    <main>
      <HeroSlider />
      <CategoryPick />
      <FavProducts />
      <BottomSlider />
    </main>
  );
}