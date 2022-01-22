export abstract class Drawable {
  abstract draw(...args: unknown[]): string
}

export abstract class DrawableModel {
  abstract sprite: {
    props: Record<string, string>,
    model: string,
  }
}