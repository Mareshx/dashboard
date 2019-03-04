#!/usr/bin/env python3

import sys
from math import fabs

def get_xi(i):
	return i * 5.0

def get_fxi_fxi1(i, rays):
	return (rays[i + 1] - rays[i]) / (get_xi(i + 1) - get_xi(i))

def get_result(i, rays):
	return (get_fxi_fxi1(i + 1, rays) - get_fxi_fxi1(i, rays)) / (get_xi(i + 2) - get_xi(i))

def get_vectors(rays):
	vectors = []
	res1 = get_result(0, rays) * 6
	res2 = get_result(1, rays) * 6
	res3 = get_result(2, rays) * 6
	vectors.append(0)
	vectors.append((res1 - 0.5 * ((-res1 + 4 * res2 -res3) / 7)) / 2)
	vectors.append((-res1 + 4 * res2 -res3) / 7)
	vectors.append((res3 - 0.5 * ((-res1 + 4 * res2 -res3) / 7)) / 2)
	vectors.append(0)
	return vectors

def get_float(str_nbr):
	try:
		nbr = float(str_nbr)
		if (nbr <= 0):
			end_error("Input contain invalid number.")
		return nbr
	except:
		end_error("Input contain invalid number.")

def get_int(str_nbr):
	try:
		nbr = int(str_nbr)
		if (nbr <= 0):
			end_error("Input contain invalid number.")
		return nbr
	except:
		end_error("Input contain invalid number.")

def get_rays():
	rays = []
	for i in range(1, 6):
		rays.append(get_float(sys.argv[i]))
	return rays

def print_vectors(vectors):
	print("vector result: [", end='')
	for i in range(0, 5):
		if vectors[i] > -0.05 and vectors[i] < 0.01:
			print("%.1f" % (fabs(vectors[i])), end='')
		else:
			print("%.1f" % (vectors[i]), end='')
		if i == 4:
			print("]")
		else:
			print(", ", end='')

def get_abscissas():
	abscissas = []
	nbr_points = get_int(sys.argv[6])
	interval = 20.0 / (nbr_points - 1.0)
	for i in range(0, nbr_points):
		abscissas.append(interval * i)
	return abscissas

def get_radius(fpi, fpi1, x, xi, xi1, fxi, fxi1):
	return -fpi1 * pow(x - xi, 3) / 30.0 + fpi * pow(x - xi1, 3) / 30.0 - (fxi1 / 5.0 - (5.0 * fpi1 / 6.0)) * (x - xi) + (fxi / 5.0 - 5.0 * fpi / 6.0) * (x - xi1)

def get_all_radius(rays, vectors, abscissas):
	radius = []
	for abscissa in abscissas:
		if abscissa < 5:
			radius.append(get_radius(vectors[1], vectors[0], abscissa, 5.0, 0.0, rays[1], rays[0]))
		elif abscissa < 10:
			radius.append(get_radius(vectors[2], vectors[1], abscissa, 10.0, 5.0, rays[2], rays[1]))
		elif abscissa < 15:
			radius.append(get_radius(vectors[3], vectors[2], abscissa, 15.0, 10.0, rays[3], rays[2]))
		else:
			radius.append(get_radius(vectors[4], vectors[3], abscissa, 20.0, 15.0, rays[4], rays[3]))
	return radius

def print_radius(abscissas, radius):
	for i in range(0, len(radius)):
		print("abscissa: %.1f cm\tradius: %.1f cm" % (abscissas[i], radius[i]))

def end_error(error_msg):
	print("ERROR: " + error_msg)
	exit(84)

def print_help():
	print("USAGE\n\t./308reedpipes r0 r5 r10 r15 r20 n\n\nDESCRIPTION\n\tr0\tradius (in cm) of pipe at the 0cm abscissa\n\tr5\tradius (in cm) of pipe at the 5cm abscissa\n\tr10\tradius (in cm) of pipe at the 10cm abscissa\n\tr15\tradius (in cm) of pipe at the 15cm abscissa\n\tr20\tradius (in cm) of pipe at the 20cm abscissa\n\tn\tnumber of points needed to display the radius")

def main():
	if len(sys.argv) == 2 and sys.argv[1] == "-h":
		print_help()
	elif len(sys.argv) == 7:
		rays = get_rays()
		vectors = get_vectors(rays)
		print_vectors(vectors)
		abscissas = get_abscissas()
		radius = get_all_radius(rays, vectors, abscissas)
		print_radius(abscissas, radius)
	else:
		end_error("Refer to -h for correct use")
	exit (0)

if __name__ == '__main__':
	main()