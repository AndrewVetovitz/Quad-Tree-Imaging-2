# Quad Tree Image Processing:

Remake of a project I did back in 2016, but we based. The origional idea was a blog post from Michael Fogleman and [his quad project.](https://github.com/fogleman/Quads).

I exanded his project, adding more functionality to the [web based version.](https://andrewvetovitz.com/static/quad-tree/)

## Color processing is Difficult and Anti-intuitive. 
The most difficult part of this project is color processing. You cannot sum and divide color by 2 to find the average you must square them, add them, divide by 2, and then take the square root. Also for color processing look into L*A*B colors which eliminate light components of colors and allow them to correctly be added. 
I used the luminance error method (error = r * .2126 + g * .7152 + b * .0722) to determine which quad to divide next. This formula is based on research and how the eye perceives color the best; green having the highest impact and blue the lowest. Using equal weights to calculate errors between colors can create weird result. This can include the image being too dark overall or in my case subdividing low-detail areas. If you want to write color dependent projects do your research before coding your project and look up materials. A video by [minute physics on colors](https://www.youtube.com/watch?v=LKnqECcg6Gw) was a good introduction to the topic.

## Below are some samples created from this project:

## Apple QuadTree made with triangles
![text](http://i.imgur.com/gL5rbNb.png, "Apple QuadTree made with triangles")

## New York Square QuadTree made with squares and a skeleton frame
![text](http://i.imgur.com/yIHrweL.png, "New York square made with squares and skeleton frame")

## Flowers QuadTree made with circles
![text](http://i.imgur.com/7XjNu91.png, "Flowers QuadTree made with circles")

## Stary Night QuadTree made with squares and a skeleton frame
![text](http://i.imgur.com/SURBJY9.png, "Starry Night made with squares and skeleton frame")

## World map QuadTree made with circles
![text](http://i.imgur.com/uAaeL8O.png, "World map made with circles")
