import { OutfitPreset, CharacterTraits } from './types';
import { getBodyPartDescriptor } from './services/geminiService';

export const LOCAL_STORAGE_KEY = 'outfitGenie_wardrobe_v1';

export const CATEGORIES = ['All', 'Casual', 'Formal', 'Lingerie', 'Athleisure', 'Costumes'];
export const SCENES = ['Original', 'White Studio', 'Luxury Apartment', 'Cyberpunk City', 'Enchanted Forest', 'Sunny Beach', 'Space Station', 'Victorian Street'];

export const HAIR_COLORS = ['Original', 'Blonde', 'Black', 'Brown', 'Red', 'Pink', 'Blue', 'White', 'Silver', 'Purple', 'Green'];
export const SKIN_TONES = ['Original', 'Pale', 'Fair', 'Medium', 'Tan', 'Dark', 'Deep', 'Ebony'];
export const BODY_TYPES = ['Original', 'Slender', 'Athletic', 'Curvy', 'Muscular', 'Chubby'];
export const BACKGROUND_COLORS = ['White', 'Light Grey', 'Dark Grey', 'Black', 'Green Screen', 'Blue Screen', 'Soft Pink', 'Beige'];
export const UNDERWEAR_COLORS = ['Black', 'White', 'Red', 'Blue', 'Pink', 'Beige', 'Grey'];
export const RENDER_STYLES = ['Anime', 'Photorealistic'];
export const UNDERWEAR_STYLES = ['Classic Set', 'Thong & Bralette', 'Boy Shorts', 'Sporty Briefs', 'Lace Teddy', 'High-Waisted'];

export const POSES = [
  'A-Pose',
  'Standing (Neutral)',
  'Model Stance (Hand on Hip)',
  'Fashion Walk',
  'Over Shoulder Look',
  'Leaning Against Wall',
  'Action (Running)',
  'Action (Jumping)',
  'Combat Stance',
  'Floating / Levitation',
  'Heroic Stance (Low Angle)',
  'Looking Back (Cinematic)',
  'Windy (Hair Flowing)',
  'Sitting (Chair)',
  'Sitting (Floor)',
  'Kneeling',
  'Reclining (Chaise)',
  'Curled Up'
];

export const DEFAULT_TRAITS: CharacterTraits = {
  hairColor: 'Original',
  skinTone: 'Original',
  bodyType: 'Original',
  backgroundColor: 'White',
  chestSize: 50,
  waistSize: 50,
  hipSize: 50,
  underwearColor: 'Black',
  underwearStyle: 'Classic Set',
  pose: 'A-Pose',
  nsfw: false,
  renderStyle: 'Anime'
};

export const PRESETS: OutfitPreset[] = [
  // --- New Risque / Edge ---
  {
    id: '42', name: 'Micro-Kini', icon: '🔥', category: 'Lingerie',
    prompt: 'a daring micro bikini set with minimal coverage and thin string ties, body-conscious silhouette',
    colors: ['Neon Green', 'Hot Pink', 'Black', 'Metallic Gold'],
    materials: ['Spandex', 'Metallic', 'Vinyl'],
    styles: ['String', 'Extreme', 'Clear Strap']
  },
  {
    id: '43', name: 'Oil Slick', icon: '💧', category: 'Costumes',
    prompt: 'an outfit made of body paint with a high-gloss oil slick texture covering key areas, artistic nudity illusion',
    colors: ['Black Oil', 'Gold', 'Silver', 'Iridescent'],
    materials: ['Liquid', 'Paint', 'Gloss'],
    styles: ['Abstract', 'Dripping', 'Full Body']
  },
  {
    id: '44', name: 'Shibari', icon: '🪢', category: 'Costumes',
    prompt: 'an artistic shibari rope harness intricately tied over the body, emphasizing form and figure',
    colors: ['Red Rope', 'Black Rope', 'Natural Hemp', 'White Rope'],
    materials: ['Rope', 'Silk Cord'],
    styles: ['Complex', 'Minimal', 'Neck to Hip']
  },
  {
    id: '45', name: 'Wet Look', icon: '💦', category: 'Casual',
    prompt: 'a white oversized t-shirt completely soaked with water, clinging to the skin, body-conscious silhouette',
    colors: ['White', 'Grey', 'Black'],
    materials: ['Cotton (Wet)', 'Sheer (Wet)'],
    styles: ['Oversized', 'Crop', 'Button Up']
  },
  {
    id: '46', name: 'Latex Catsuit', icon: '🐈‍⬛', category: 'Costumes',
    prompt: 'a skin-tight shiny black latex catsuit with a zipper down the front, figure-hugging and provocative',
    colors: ['Black', 'Red', 'Pink', 'Purple'],
    materials: ['Latex', 'PVC', 'Vinyl'],
    styles: ['Full Body', 'Sleeveless', 'Keyhole', 'Hooded']
  },
  {
    id: '47', name: 'Succubus', icon: '😈', category: 'Costumes',
    prompt: 'a revealing leather succubus outfit with wings and small horns, alluring design',
    colors: ['Black', 'Deep Red', 'Purple'],
    materials: ['Leather', 'Latex', 'Chain'],
    styles: ['Demonic', 'Gothic', 'Fantasy']
  },
  {
    id: '48', name: 'Pasties', icon: '✨', category: 'Lingerie',
    prompt: 'decorative crystal pasties and a matching micro-thong, featuring artistic nudity',
    colors: ['Crystal', 'Black Tape', 'Gold', 'Heart Shaped'],
    materials: ['Rhinestone', 'Tape', 'Sequins'],
    styles: ['Star', 'Heart', 'Cross', 'Circle']
  },
  {
    id: '49', name: 'Body Paint', icon: '🎨', category: 'Costumes',
    prompt: 'intricate high-fashion body paint design covering specific areas, featuring a liquid chrome effect, metallic body art, opalescent finish, and a second-skin texture',
    colors: ['Liquid Gold', 'Chrome Silver', 'Iridescent Oil Slick', 'Matte Black'],
    materials: ['Liquid Paint', 'Metallic Pigment', 'Gloss'],
    styles: ['Full Body', 'Abstract', 'Tribal', 'Geometric']
  },

  // --- Lingerie ---
  { 
    id: '10', name: 'Lace Set', icon: '🖤', category: 'Lingerie',
    prompt: 'a decorative lace lingerie set with intricate floral patterns, translucent details, and fine fabric that mimics skin tone for a risque artistic illusion',
    colors: ['Black', 'Red', 'White', 'Purple', 'Navy', 'Nude'],
    materials: ['Lace', 'Silk', 'Velvet', 'Sheer'],
    styles: ['Gothic', 'Elegant', 'Bridal', 'Risque']
  },
  { 
    id: '12', name: 'Slip Dress', icon: '🥂', category: 'Lingerie',
    prompt: 'a satin silk slip dress nightgown with delicate lace trim, alluring design',
    colors: ['Champagne', 'Black', 'Red', 'Emerald', 'White'],
    materials: ['Satin', 'Silk', 'Velvet', 'Chiffon'],
    styles: ['Short', 'Long', 'Backless', 'Pleated', 'Vintage']
  },
  { 
    id: '13', name: 'Cute Camisole', icon: '🎀', category: 'Lingerie',
    prompt: 'a soft cotton camisole and matching panties set with small bow details',
    colors: ['Pastel Blue', 'Pink', 'Lavender', 'Mint', 'White'],
    materials: ['Cotton', 'Silk Blend', 'Ribbed Knit'],
    styles: ['Striped', 'Plain', 'Bear Print', 'Ruffled', 'Cropped']
  },
  { 
    id: '14', name: 'Corset', icon: '⏳', category: 'Lingerie',
    prompt: 'a structured corset bodice paired with ruffled bloomers',
    colors: ['White', 'Black', 'Red', 'Cream', 'Pink'],
    materials: ['Satin', 'Lace', 'Leather', 'Brocade'],
    styles: ['Victorian', 'Steampunk', 'Burlesque', 'Modern', 'Underbust']
  },
  { 
    id: '15', name: 'Sheer Robe', icon: '🌫️', category: 'Lingerie',
    prompt: 'a flowy sheer robe worn loosely over matching undergarments',
    colors: ['White', 'Black', 'Pink', 'Lavender', 'Red'],
    materials: ['Sheer', 'Silk', 'Organza', 'Chiffon', 'Lace'],
    styles: ['Long', 'Short', 'Fur Trimmed', 'Kimono']
  },
  { 
    id: '27', name: 'Lace Bodysuit', icon: '🩰', category: 'Lingerie',
    prompt: 'a fitted floral lace bodysuit with high-cut legs, figure-hugging',
    colors: ['Black', 'White', 'Red', 'Navy', 'Emerald'],
    materials: ['Lace', 'Mesh', 'Spandex', 'Velvet'],
    styles: ['Halter', 'Long Sleeve', 'Strapless', 'Deep-V', 'Backless']
  },
  { 
    id: '28', name: 'Babydoll', icon: '👗', category: 'Lingerie',
    prompt: 'a sheer babydoll chemise with ruffled hem and soft cups',
    colors: ['Pink', 'Lavender', 'White', 'Light Blue', 'Black'],
    materials: ['Chiffon', 'Tulle', 'Silk', 'Lace'],
    styles: ['Ruffled', 'Pleated', 'Ribbon', 'Open Front', 'Cute']
  },
  { 
    id: '29', name: 'Garter Set', icon: '🕸️', category: 'Lingerie',
    prompt: 'a matching bra and panty set with a garter belt and sheer stockings, alluring design',
    colors: ['Black', 'Red', 'White', 'Burgundy', 'Nude'],
    materials: ['Lace', 'Satin', 'Leather', 'Mesh'],
    styles: ['Classic', 'Strappy', 'High-Waist', 'Thigh-Highs', 'Bridal']
  },
  { 
    id: '30', name: 'Satin PJs', icon: '🌙', category: 'Lingerie',
    prompt: 'a luxurious silk satin pajama set with a button-up top and shorts',
    colors: ['Champagne', 'Navy', 'Black', 'Rose Gold', 'Silver'],
    materials: ['Silk', 'Satin', 'Velvet', 'Cotton'],
    styles: ['Shorts', 'Long Pants', 'Robe Set', 'Lace Trim', 'Oversized']
  },
  { 
    id: '31', name: 'Sheer Teddy', icon: '🧸', category: 'Lingerie',
    prompt: 'a playful one-piece teddy with ribbon ties, sheer panels, and illusion mesh that blends with the skin',
    colors: ['Red', 'Pink', 'Black', 'White', 'Mint', 'Nude'],
    materials: ['Lace', 'Mesh', 'Satin ribbons', 'Organza'],
    styles: ['Cutout', 'Backless', 'Halter', 'Bow Tie', 'Frilly']
  },
  { 
    id: '32', name: 'Fishnet', icon: '🕸️', category: 'Lingerie',
    prompt: 'a daring fishnet bodystocking worn over minimal undergarments, figure-hugging',
    colors: ['Black', 'Neon Green', 'Hot Pink', 'White'],
    materials: ['Fishnet', 'Mesh', 'Spandex'],
    styles: ['Punk', 'Rave', 'Goth', 'Edgy']
  },
  { 
    id: '33', name: 'Bridal Set', icon: '👰', category: 'Lingerie',
    prompt: 'an intricate bridal lingerie set with a veil, garter, and stockings',
    colors: ['White', 'Ivory', 'Cream', 'Silver', 'Blue'],
    materials: ['Lace', 'Silk', 'Tulle', 'Pearl'],
    styles: ['Romantic', 'Classic', 'Elegant', 'Wedding']
  },
  { 
    id: '34', name: 'Latex Set', icon: '🖤', category: 'Lingerie',
    prompt: 'a shiny form-fitting latex lingerie set with high-gloss finish that clings like a second skin, creating a provocative illusion of artistic nudity and a seamless liquid-look',
    colors: ['Black', 'Red', 'Pink', 'Purple', 'Nude'],
    materials: ['Latex', 'Vinyl', 'PVC', 'Rubber'],
    styles: ['Fetish', 'Modern', 'Shiny', 'Dominant']
  },
  { 
    id: '35', name: 'Harness', icon: '⛓️', category: 'Lingerie',
    prompt: 'a complex strappy body harness worn over matching lingerie, body-conscious silhouette',
    colors: ['Black', 'Red', 'White', 'Neon', 'Gold'],
    materials: ['Leather', 'Elastic', 'Satin', 'Metal'],
    styles: ['Edgy', 'Gothic', 'Modern', 'Industrial']
  },
  { 
    id: '36', name: 'Cheongsam', icon: '🧧', category: 'Lingerie',
    prompt: 'a lingerie-style qipao top with keyhole chest and matching panties',
    colors: ['Red/Gold', 'Black/Red', 'Blue/Silver', 'Pink/White'],
    materials: ['Silk', 'Brocade', 'Satin'],
    styles: ['Traditional', 'Elegant', 'Fusion', 'Cutout']
  },
  {
    id: '37', name: 'String Set', icon: '🧵', category: 'Lingerie',
    prompt: 'a provocative micro-string lingerie set with minimal coverage and tie closures, alluring design',
    colors: ['Black', 'Red', 'Neon Pink', 'White', 'Gold'],
    materials: ['Satin', 'Elastic', 'Cotton'],
    styles: ['Micro', 'Tie-Side', 'Minimalist', 'Brazilian']
  },
  {
    id: '38', name: 'Cage Bra', icon: '⛓️', category: 'Lingerie',
    prompt: 'an edgy strappy elastic cage bra set with geometric cutouts',
    colors: ['Black', 'Red', 'Neon Green', 'White'],
    materials: ['Elastic', 'Satin', 'Leather'],
    styles: ['Pentagram', 'Geometric', 'Fetish', 'Modern']
  },
  {
    id: '39', name: 'Pearl Set', icon: '🐚', category: 'Lingerie',
    prompt: 'a luxury lingerie set embellished with draped pearl strands and crystals',
    colors: ['White/Pearl', 'Black/Pearl', 'Gold', 'Silver'],
    materials: ['Pearls', 'Chains', 'Lace', 'Silk'],
    styles: ['Burlesque', 'Luxury', 'Bridal', 'Jewelry']
  },
  {
    id: '40', name: 'Risqué Open', icon: '🔥', category: 'Lingerie',
    prompt: 'a daring open-silhouette lingerie set with strategic cutouts and ribbons, alluring design',
    colors: ['Red', 'Black', 'Purple', 'Pink'],
    materials: ['Lace', 'Satin', 'Mesh'],
    styles: ['Ouvert', 'Ribbon', 'Bow', 'Provocative']
  },
  {
    id: '41', name: 'Velvet Body', icon: '🍷', category: 'Lingerie',
    prompt: 'a crushed velvet bodysuit with deep-v neckline and high-cut legs, figure-hugging',
    colors: ['Burgundy', 'Emerald', 'Navy', 'Black', 'Rose'],
    materials: ['Velvet', 'Lace Trim'],
    styles: ['Deep-V', 'Thong Back', 'Long Sleeve', 'Sleeveless']
  },

  // --- Athleisure ---
  { 
    id: '11', name: 'Sporty Set', icon: '🏃‍♀️', category: 'Athleisure',
    prompt: 'a fitted sports bra and matching compression shorts with a branded waistband',
    colors: ['Grey', 'Black', 'White', 'Neon Yellow', 'Pink'],
    materials: ['Spandex', 'Cotton Blend', 'Mesh', 'Nylon'],
    styles: ['Gym', 'Yoga', 'Boxing', 'Casual', 'Seamless']
  },
  { 
    id: '8', name: 'School Swim', icon: '🏊‍♀️', category: 'Athleisure',
    prompt: 'a classic one-piece school swimsuit with a nametag on the chest',
    colors: ['Navy Blue', 'Black', 'White', 'Dark Green'],
    materials: ['Spandex', 'Nylon', 'Matte'],
    styles: ['Classic', 'High-Cut', 'Competition', 'Modern', 'Retro']
  },
  { 
    id: '7', name: 'Bikini', icon: '👙', category: 'Athleisure',
    prompt: 'a two-piece bikini set with tie-side bottoms',
    colors: ['Pink', 'Baby Blue', 'Yellow', 'Black', 'Red', 'White'],
    materials: ['Spandex', 'Cotton', 'Crochet'],
    styles: ['Polka Dot', 'Striped', 'Solid', 'Floral', 'Ruffled', 'High-Waist']
  },
  {
    id: '19', name: 'Yoga Fit', icon: '🧘‍♀️', category: 'Athleisure',
    prompt: 'seamless high-waisted leggings and a matching tight crop top',
    colors: ['Lavender', 'Mint', 'Peach', 'Black', 'Teal'],
    materials: ['Spandex', 'Nylon', 'Ribbed Fabric'],
    styles: ['Seamless', 'Ribbed', 'Cutout', 'Ombre', 'Tie-Dye']
  },
  {
    id: '20', name: 'Tracksuit', icon: '👟', category: 'Athleisure',
    prompt: 'a loose athletic tracksuit with side stripes and an unzipped jacket',
    colors: ['Red/White', 'Blue/Yellow', 'Black/Gold', 'Green/White'],
    materials: ['Nylon', 'Velour', 'Polyester', 'Cotton'],
    styles: ['Retro', 'Modern', 'Slim Fit', 'Oversized']
  },

  // --- Casual Wear ---
  { 
    id: '5', name: 'Hoodie', icon: '🎧', category: 'Casual',
    prompt: 'an oversized streetwear hoodie paired with denim shorts',
    colors: ['Grey', 'Black', 'Tie-Dye', 'White', 'Beige', 'Pink'],
    materials: ['Cotton', 'Fleece', 'Polyester Blend'],
    styles: ['Oversized', 'Crop', 'Zip-up', 'Graphic', 'Sleeveless']
  },
  { 
    id: '2', name: 'Summer Dress', icon: '☀️', category: 'Casual',
    prompt: 'a light sundress with thin straps and a flowy skirt',
    colors: ['White', 'Yellow', 'Blue', 'Red', 'Floral', 'Green'],
    materials: ['Cotton', 'Linen', 'Chiffon', 'Rayon'],
    styles: ['Floral', 'Solid', 'Polka Dot', 'Maxi', 'Mini', 'Boho']
  },
  { 
    id: '16', name: 'Mesh Top', icon: '🕸️', category: 'Casual',
    prompt: 'a trendy mesh net top worn over a solid bandeau',
    colors: ['Black', 'White', 'Neon Green', 'Hot Pink', 'Purple'],
    materials: ['Fishnet', 'Fine Mesh', 'Sheer Fabric'],
    styles: ['Long Sleeve', 'Crop', 'T-Shirt', 'Layered']
  },
  {
    id: '21', name: 'Denim Look', icon: '👖', category: 'Casual',
    prompt: 'a denim jacket worn over a basic t-shirt and jeans',
    colors: ['Blue', 'Black', 'Acid Wash', 'White', 'Grey'],
    materials: ['Denim', 'Jean', 'Canvas'],
    styles: ['Ripped', 'Baggy', 'Fitted', 'Vintage', 'Cropped']
  },
  {
    id: '22', name: 'Cozy Knit', icon: '🧶', category: 'Casual',
    prompt: 'an off-shoulder cable knit sweater paired with soft leggings',
    colors: ['Cream', 'Beige', 'Grey', 'Maroon', 'Mustard', 'Olive'],
    materials: ['Wool', 'Cashmere', 'Cotton Knit', 'Chenille'],
    styles: ['Off-shoulder', 'Turtleneck', 'Oversized', 'Cardigan']
  },

  // --- Formal Wear ---
  { 
    id: '6', name: 'Evening Gown', icon: '💃', category: 'Formal',
    prompt: 'an elegant floor-length evening gown with an off-shoulder neckline',
    colors: ['Emerald', 'Ruby', 'Black', 'Sapphire', 'Gold', 'Silver'],
    materials: ['Silk', 'Velvet', 'Sequins', 'Satin', 'Tulle'],
    styles: ['Mermaid', 'Ballgown', 'Slit', 'A-Line', 'Backless']
  },
  {
    id: '23', name: 'Business Suit', icon: '💼', category: 'Formal',
    prompt: 'a tailored blazer and pencil skirt suit with a professional blouse',
    colors: ['Black', 'Navy', 'Grey', 'Pinstripe', 'Beige', 'White'],
    materials: ['Wool Blend', 'Polyester', 'Tweed', 'Linen'],
    styles: ['Skirt Suit', 'Pant Suit', 'Modern', 'Fitted', 'Oversized Blazer']
  },
  {
    id: '24', name: 'Cocktail Dress', icon: '🍸', category: 'Formal',
    prompt: 'a chic knee-length party dress with a fitted silhouette',
    colors: ['Gold', 'Silver', 'Black', 'Red', 'Rose Gold', 'Royal Blue'],
    materials: ['Sequins', 'Satin', 'Velvet', 'Metallic', 'Silk'],
    styles: ['Strapless', 'One-Shoulder', 'Halter', 'Wrap']
  },

  // --- Costumes / Fantasy ---
  { 
    id: '1', name: 'Cyberpunk', icon: '🤖', category: 'Costumes',
    prompt: 'a futuristic bodysuit with technical interface elements and glowing accents',
    colors: ['Neon Green', 'Hot Pink', 'Cyan', 'Red', 'Yellow', 'Purple'],
    materials: ['Latex', 'Carbon Fiber', 'Metal Plate', 'Vinyl', 'Spandex'],
    styles: ['Tactical', 'Hacker', 'Biker', 'Android', 'Mecha']
  },
  { 
    id: '17', name: 'Clear Vinyl', icon: '🧥', category: 'Costumes',
    prompt: 'a transparent vinyl raincoat jacket with colored trim',
    colors: ['Clear', 'Pink Tint', 'Blue Tint', 'Iridescent', 'Smoke'],
    materials: ['PVC', 'Vinyl', 'Plastic'],
    styles: ['Jacket', 'Skirt', 'Cape', 'Poncho', 'Dress']
  },
  { 
    id: '18', name: 'Glass Armor', icon: '💎', category: 'Costumes',
    prompt: 'crystalline plate armor that glows with magical energy',
    colors: ['Diamond', 'Ruby', 'Sapphire', 'Emerald', 'Amethyst', 'Obsidian'],
    materials: ['Crystal', 'Glass', 'Energy', 'Magic'],
    styles: ['Plate', 'Scale', 'Robe', 'Warrior', 'Mage']
  },
  { 
    id: '3', name: 'School Uniform', icon: '🎓', category: 'Costumes',
    prompt: 'a sailor-style school uniform with a pleated skirt and neck ribbon',
    colors: ['Navy Blue', 'Black', 'Grey', 'Brown', 'Green'],
    materials: ['Cotton', 'Polyester', 'Wool'],
    styles: ['Sailor', 'Blazer', 'Cardigan', 'Summer', 'Winter']
  },
  { 
    id: '4', name: 'Fantasy Armor', icon: '🛡️', category: 'Costumes',
    prompt: 'ornate plate armor with intricate filigree and a flowing cape',
    colors: ['Silver', 'Gold', 'Black Iron', 'Bronze', 'Rose Gold'],
    materials: ['Steel', 'Mithril', 'Leather', 'Dragon Scale'],
    styles: ['Knight', 'Rogue', 'Mage', 'Paladin', 'Valkyrie']
  },
  { 
    id: '9', name: 'Bath Towel', icon: '♨️', category: 'Costumes',
    prompt: 'a fluffy bath towel wrapped around the body',
    colors: ['White', 'Pink', 'Beige', 'Blue', 'Striped'],
    materials: ['Cotton Terry', 'Microfiber', 'Silk'],
    styles: ['Wrapped', 'Loose', 'Head Towel', 'Onsen']
  },
  {
    id: '25', name: 'Witch', icon: '🧹', category: 'Costumes',
    prompt: 'a modern witch outfit with a wide-brimmed hat and a dress',
    colors: ['Black', 'Purple', 'Deep Blue', 'Burgundy', 'Forest Green'],
    materials: ['Velvet', 'Silk', 'Lace', 'Cotton'],
    styles: ['Classic', 'Modern', 'Gothic', 'Cute', 'Forest']
  },
  {
    id: '26', name: 'Maid', icon: '🧁', category: 'Costumes',
    prompt: 'a french maid costume with a frilly apron, headband, and dress',
    colors: ['Black/White', 'Pink/White', 'Blue/White', 'Red/White'],
    materials: ['Cotton', 'Satin', 'Polyester'],
    styles: ['Classic', 'Mini', 'Gothic', 'Traditional', 'Cat Maid']
  }
];